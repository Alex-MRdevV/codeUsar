import { sql } from "drizzle-orm";
import { sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const User = sqliteTable(
	"User",
	{
		id: text("id", { length: 100 }).primaryKey(),
		name: text("name", { length: 100 }).notNull(),
		email: text("email", { length: 100 }).notNull().unique(),
		password: text("password", { length: 100 }).notNull(),
		createdAt: text("created_at").default(sql`( DATETIME('now','localtime'))`),
	},
	(table) => [
		index("idx_user_email").on(table.email),
	]
);
