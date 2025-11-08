import { User } from "@/db/schema/users";
import { db } from "@/utils/db";
import { and, eq, ne, sql } from "drizzle-orm";

export const existsUser = db
	.select({
		id: User.id,
		password: User.password,
		rol: User.rol,
		nombre: User.nombre,
		userSecretJWT: User.secretUserJWT,
	})
	.from(User)
	.where(
		and(
			eq(User.email, sql.placeholder("email")),
			ne(User.estado, "retirado"),
			eq(User.rol, sql.placeholder("rol"))
		)
	)
	.prepare();
