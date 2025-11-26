import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Users = sqliteTable(
	"Users",
	{
		id: text("id", { length: 191 }).primaryKey(),
		name: text("name", { length: 191 }).notNull(),
		email: text("email", { length: 191 }).notNull().unique(),
		status: text("status", { enum: ["activo", "retirado"] }).default("activo"),
		createdAt: integer("created_at", { mode: "timestamp_ms" }).default(
			sql`(unixepoch() * 1000)`
		),
	},
	(table) => [
		index("idx_user_status").on(table.status),
		index("idx_user_email").on(table.email),
	]
);
