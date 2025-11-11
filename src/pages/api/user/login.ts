import { accessToken } from "@/lib/accessTokens";
import { existsUser } from "@/lib/drizzle/auth/existsUsers";
import { loginSchema } from "@/lib/schemas/user/auth";
import { getDb } from "@/utils/db";
import { verifyPassword } from "@/utils/password/verify";
import { res } from "@/utils/responseAstro";
import { type APIRoute } from "astro";
import { safeParse } from "valibot";

export const POST: APIRoute = async ({ request, cookies, locals }) => {
	const { success, issues, output } = safeParse(
		loginSchema,
		await request.json()
	);

	if (!success) return res(issues[0].message, { status: 400 });

	const { email, password, rol } = output;

	try {
		const db = getDb(locals.runtime.env.DB);

		const [user] = await existsUser(db).execute({
			email: email,
			estado: "activo",
			rol: rol,
		});

		if (!user)
			return res({ message: "Credenciales incorrectas" }, { status: 403 });

		const isMatch = await verifyPassword(user.password, password);

		if (!isMatch)
			return res({ message: "Credenciales incorrectas" }, { status: 401 });

		const token = await accessToken({
			id: user.id,
			rol: user.rol,
			nombre: user.nombre,
			userSecretJWT: user.userSecretJWT,
		});

		cookies.set("tokenAcceso", token, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
		});

		return res({ user }, { status: 200 });
	} catch (error) {
		return res("Algo ha salido mal", { status: 500 });
	}
};
