import { User } from "@/db/schema/users";
import { accessToken } from "@/lib/accessTokens";
import { existsUser } from "@/lib/drizzle/auth/existsUsers";
import { registerSchema } from "@/lib/schemas/user/register";
import { getDb } from "@/utils/db";
import { passwordGenerate } from "@/utils/password/generate";
import { hashPassword } from "@/utils/password/hashPassword";
import { res } from "@/utils/responseAstro";
import { uuid } from "@/utils/uuid";
import { type APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies, locals }) => {
	const { success, data, error } = registerSchema.safeParse(
		await request.json()
	);

	if (!success) return res(error.message, { status: 400 });

	const { email, rol, confirmPassword, nombre } = data;

	try {
		const db = getDb(locals.runtime.env.DB);

		const [user] = await existsUser(db).execute({
			email: email,
			estado: "activo",
		});

		if (user) return res({ message: "El usuario ya existe" }, { status: 400 });

		const { hash, salt } = await hashPassword(confirmPassword);
		const passwordHashed = `${salt}:${hash}`;
		const userSecret = passwordGenerate();
		const { hash: secretHash, salt: secretSalt } = await hashPassword(
			userSecret
		);
		const secretPasswordJWTHashed = `${secretSalt}:${secretHash}`;

		const [newUser] = await db
			.insert(User)
			.values({
				id: uuid.uuid,
				email: email,
				password: passwordHashed,
				nombre: nombre,
				rol: rol,
				secretUserJWT: secretPasswordJWTHashed,
			})
			.returning({
				id: User.id,
				rol: User.rol,
				nombre: User.nombre,
				userSecretJWT: User.secretUserJWT,
			});

		if (!newUser)
			return res({ message: "Algo ha salido mal" }, { status: 500 });

		const token = await accessToken(newUser);

		cookies.set("tokenAcceso", token, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
		});

		return res(newUser, { status: 200 });
	} catch (error) {
		return res({ message: "Algo ha salido mal" }, { status: 500 });
	}
};
