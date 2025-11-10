import { existsUser, existUserById } from "@/lib/drizzle/auth/existsUsers";
import { res } from "@/utils/responseAstro";
import { type APIRoute } from "astro";
import { accessToken } from "@/lib/accessTokens";
import { hashPassword } from "@/utils/password/hashPassword";
import { passwordGenerate } from "@/utils/password/generate";
import { getDb } from "@/utils/db";
import { User } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { regenerateTokenSchema } from "@/lib/schemas/user/register";

export const POST: APIRoute = async ({ request, cookies, locals }) => {
	const { success, data, error } = regenerateTokenSchema.safeParse(
		await request.json()
	);

	if (!success) return res(error.message, { status: 400 });

	const { id, email } = data;

	try {
		const db = getDb(locals.runtime.env.DB);
		const [user] = await existsUser(db).execute({
			email: email,
			estado: "activo",
		});

		if (!user)
			return res({ message: "Usuario no encontrado" }, { status: 404 });

		// Generar nuevo secret JWT para invalidar todos los tokens anteriores
		const userSecret = passwordGenerate();
		const { hash: secretHash, salt: secretSalt } = await hashPassword(
			userSecret
		);
		const secretPasswordJWTHashed = `${secretSalt}:${secretHash}`;

		// Actualizar el secretUserJWT en la base de datos
		const [updatedUser] = await db
			.update(User)
			.set({
				secretUserJWT: secretPasswordJWTHashed,
			})
			.where(eq(User.id, id))
			.returning({
				id: User.id,
				rol: User.rol,
				nombre: User.nombre,
				userSecretJWT: User.secretUserJWT,
			});

		if (!updatedUser)
			return res({ message: "Error al regenerar token" }, { status: 500 });

		// Generar nuevo access token con el nuevo secret
		const token = await accessToken({
			id: updatedUser.id,
			rol: updatedUser.rol,
			nombre: updatedUser.nombre,
			userSecretJWT: updatedUser.userSecretJWT,
		});

		// Establecer la nueva cookie (esto cierra todas las sesiones anteriores)
		cookies.set("tokenAcceso", token, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
		});

		return res(
			{
				message:
					"Token regenerado exitosamente. Todas las sesiones anteriores han sido invalidadas",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error al regenerar token:", error);
		return res({ message: "Algo ha salido mal" }, { status: 500 });
	}
};
