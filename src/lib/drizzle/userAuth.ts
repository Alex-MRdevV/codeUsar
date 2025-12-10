import { db } from "@/db/db";
import { User } from "@/db/schemaTransitional/user";
import { and, eq, sql } from "drizzle-orm";

export const existsUser = db
	.select({
		id: User.id,
		password: User.password,
		name: User.name,
	})
	.from(User)
	.where(and(eq(User.email, sql.placeholder("email"))))
	.prepare();
