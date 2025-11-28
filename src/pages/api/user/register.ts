import { Users } from "@/db/schema/users";
import { accessToken } from "@/lib/accessToken";
import { existsUser } from "@/lib/drizzle/auth/existsUsers";
import { registerSchema } from "@/lib/schemas/user/register";
import { passwordGenerate } from "@/utils/password/generate";
import { hashPassword } from "@/utils/password/hashPassword";
import { res } from "@/utils/responseAstro";
import { uuid } from "@/utils/uuid";
import { type APIRoute } from "astro";
import { safeParse } from "valibot";

export const POST: APIRoute = async ({ request, cookies, locals }) => {
	const { env } = locals.runtime;
	const PHONE_NUMBER_ID = env.WHATSAPP_PHONE_ID;
	const ACCESS_TOKEN = env.WHATSAPP_ACCESS_TOKEN;


	const { success, issues, output } = safeParse(
		registerSchema,
		await request.json()
	);

	if (!success) return res(issues[0].message, { status: 400 });
	const { email, confirmPassword, nombre } = output;

	try {
		const [user] = await existsUser.execute({
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
			.insert(Users)
			.values({
				id: uuid.uuid,
				email: email,
				password: passwordHashed,
				nombre: nombre,
				secretUserJWT: secretPasswordJWTHashed,
			})
			.returning({
				id: Users.id,
				nombre: Users.name,
				accessToken: Users.
				userSecretJWT: Users.secretUserJWT,
			});

		if (!newUser)
			return res({ message: "Algo ha salido mal" }, { status: 500 });

		const token = await accessToken(newUser);
		cookies.set("tokenAcceso", token, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
		});

		return res({ newUser }, { status: 200 });
	} catch (error) {
		return res({ message: "Algo ha salido mal" }, { status: 500 });
	}
};
