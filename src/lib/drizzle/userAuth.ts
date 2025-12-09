import { db } from "@/db/db";
import { User } from "@/db/schemaTransitional/user";
import { and, eq, ne, sql } from "drizzle-orm";

export const existsUser = db
	.select({
		id: User.id,
		password: User.password,
		role: User.role,
		name: User.name,
	})
	.from(User)
	.where(
		and(
			eq(User.email, sql.placeholder("email")),
			eq(User.role, sql.placeholder("role")),
			ne(User.status, "retirado")
		)
	)
	.prepare();
