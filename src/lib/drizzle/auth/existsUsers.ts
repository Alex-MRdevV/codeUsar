/*
import { db } from "@/db/db";
import { User } from "@/db/schema/user";
import { and, eq, ne, sql } from "drizzle-orm";

export const existsUser = db
	.select({
		id: User.id,
	})
	.from(User)
	.where(
		and(eq(User.email, sql.placeholder("email")), ne(User.status, "retirado"))
	)
	.prepare();

export const createUser = db
	.insert(User)
	.values({
		id: sql.placeholder("id"),
		name: sql.placeholder("name"),
		email: sql.placeholder("email"),
		status: sql.placeholder("status"),
		createdAt: sql.placeholder("createdAt"),
	})
	.prepare();
*/