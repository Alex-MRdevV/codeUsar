import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Interviewer = sqliteTable(
	"Interviewer",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		name: text("name").notNull(),
		email: text("email").notNull().unique(),
		created_at: integer("created_at", { mode: "timestamp" }),
	},
	(table) => [
		index("idx_interviewer_email").on(table.email),
		index("idx_interviewer_name").on(table.name),
	]
);
