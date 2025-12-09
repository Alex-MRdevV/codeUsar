import { accessToken } from "@/lib/accessToken";
import { existsUser } from "@/lib/drizzle/userAuth";
import { loginSchema } from "@/lib/schemas/user/login";
import { verifyPassword } from "@/utils/password/verify";
import { res } from "@/utils/responseAstro";
import { type APIRoute } from "astro";
import { safeParse } from "valibot";

export const POST: APIRoute = async ({ request, cookies }) => {
	const { success, issues, output } = safeParse(
		loginSchema,
		await request.json()
	);

	if (!success) return res(issues[0].message, { status: 400 });
	const { email, password, role } = output;

	try {
		const [user] = await existsUser.execute({
			email: email,
			role: role,
			status: "activo",
		});

		if (!user)
			return res({ message: "Credenciales incorrectas" }, { status: 403 });

		const isMatch = await verifyPassword(user.password, password);

		if (!isMatch)
			return res({ message: "Credenciales incorrectas" }, { status: 401 });

		const token = await accessToken({
			id: user.id,
			role: user.role,
			name: user.name,
		});

		cookies.set("tokenAcceso", token, {
			httpOnly: false,
			secure: false,
			sameSite: "strict",
		});

		return res({ user: user }, { status: 200 });
	} catch (error) {
		return res("Algo ha salido mal", { status: 500 });
	}
};
