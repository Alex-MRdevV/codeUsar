import { User } from "@/db/schema/users";
import { accessToken } from "@/lib/accessTokens";
import { db } from "@/lib/db";
import { existsUser, existUserById } from "@/lib/drizzle/auth/existsUsers";
import { updateSchema } from "@/lib/schemas/user/register";
import { passwordGenerate } from "@/utils/password/generate";
import { hashPassword } from "@/utils/password/hashPassword";
import { res } from "@/utils/responseAstro";
import { type APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { safeParse } from "valibot";

export const POST: APIRoute = async ({ request, cookies, locals }) => {
	const { success, issues, output } = safeParse(
		updateSchema,
		await request.json()
	);
	if (!success) return res(issues[0].message, { status: 400 });

	const { email, id, password, nombre } = output;

	try {
		// Verificar que el usuario a actualizar existe
		const [user] = await existUserById.execute({
			id: id,
		});

		if (!user)
			return res({ message: "Usuario no encontrado" }, { status: 404 });

		// Si se proporciona un email, verificar que no esté en uso
		if (email) {
			const [existingUserByEmail] = await existsUser.execute({
				email: email,
				estado: "activo",
			});

			// Si existe un usuario con ese email Y no es el mismo usuario que estamos actualizando
			if (existingUserByEmail && existingUserByEmail.id !== id)
				return res({ message: "El email ya está en uso" }, { status: 400 });
		}

		// Preparar los datos a actualizar
		const updateData: any = {};

		if (nombre) updateData.nombre = nombre;
		if (email) updateData.email = email;

		// Si se proporciona nueva contraseña, hashearla
		if (password) {
			const { hash, salt } = await hashPassword(password);
			updateData.password = `${salt}:${hash}`;

			// Generar nuevo secret para invalidar tokens anteriores
			const userSecret = passwordGenerate();
			const { hash: secretHash, salt: secretSalt } = await hashPassword(
				userSecret
			);
			updateData.secretUserJWT = `${secretSalt}:${secretHash}`;
		}

		// Actualizar el usuario
		const [updatedUser] = await db
			.update(User)
			.set(updateData)
			.where(eq(User.id, id))
			.returning({
				id: User.id,
				rol: User.rol,
				nombre: User.nombre,
				email: User.email,
				userSecretJWT: User.secretUserJWT,
			});

		if (!updatedUser)
			return res({ message: "Error al actualizar usuario" }, { status: 500 });

		// Generar nuevo token con los datos actualizados
		const token = await accessToken({
			id: updatedUser.id,
			rol: updatedUser.rol,
			nombre: updatedUser.nombre,
			userSecretJWT: updatedUser.userSecretJWT,
		});

		cookies.set("tokenAcceso", token, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
		});

		return res(
			{
				message: "Usuario actualizado exitosamente",
			},
			{ status: 200 }
		);
	} catch (error) {
		return res({ message: "Algo ha salido mal" }, { status: 500 });
	}
};
