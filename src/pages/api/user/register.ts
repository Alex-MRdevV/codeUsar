import { db } from "@/db/db";
import { User } from "@/db/schemaTransitional/user";
import { accessToken } from "@/lib/accessToken";
import { existsUser } from "@/lib/drizzle/userAuth";
import { registerSchema } from "@/lib/schemas/user/register";
import { hashPassword } from "@/utils/password/hashPassword";
import { res } from "@/utils/responseAstro";
import { uuid } from "@/utils/uuid";
import { type APIRoute } from "astro";
import { safeParse } from "valibot";

export const POST: APIRoute = async ({ request, cookies }) => {
	const { success, issues, output } = safeParse(
		registerSchema,
		await request.json()
	);

	if (!success) return res(issues[0].message, { status: 400 });

	const { confirmPassword, email, name, role } = output;

	try {
		const [user] = await existsUser.execute({
			email: email,
			role: role,
			status: "activo",
		});

		if (user) return res({ message: "El usuario ya existe" }, { status: 400 });

		const { hash, salt } = await hashPassword(confirmPassword);
		const passwordHashed = `${salt}:${hash}`;

		const result = await db.insert(User).values({
			id: uuid.uuid,
			email: email,
			password: passwordHashed,
			name: name,
			role: role,
		});

		if (!result) return res({ message: "Algo ha salido mal" }, { status: 500 });

		const [newUser] = await existsUser.execute({
			email: email,
			role: role,
			status: "activo",
		});

		const token = await accessToken(newUser);

		cookies.set("tokenAcceso", token, {
			httpOnly: false,
			secure: false,
			sameSite: "strict",
		});

		return res({ user: newUser }, { status: 200 });
	} catch (error) {
		return res({ message: "Algo ha salido mal" }, { status: 500 });
	}
};
