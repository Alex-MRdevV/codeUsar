import { User } from "@/db/schema/users";
import { type Database } from "@/utils/db";
import { and, eq, ne, sql } from "drizzle-orm";

export const existUserById = (db: Database) => db
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
			eq(User.id, sql.placeholder("id")),
			ne(User.estado, "retirado"),
		)
	)
	.prepare();

export const existsUser = (db: Database) => db
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
