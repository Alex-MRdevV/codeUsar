import { type Database } from "@/db/db";
import { Users } from "@/db/schema/users";
import { and, eq, ne, sql } from "drizzle-orm";

export const existUserById = (db: Database) =>
	db
		.select({
			id: Users.id,
			nombre: Users.name,
		})
		.from(Users)
		.where(
			and(eq(Users.id, sql.placeholder("id")), ne(Users.status, "retirado"))
		)
		.prepare();

export const existsUser = (db: Database) =>
	db
		.select({
			id: Users.id,
			nombre: Users.name,
			email: Users.email,
		})
		.from(Users)
		.where(
			and(
				eq(Users.email, sql.placeholder("email")),
				ne(Users.status, "retirado")
			)
		)
		.prepare();
