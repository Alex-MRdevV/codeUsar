import {
	index,
	int,
	mysqlTable,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";

export const Interviewer = mysqlTable(
	"Interviewer",
	{
		id: int("id").primaryKey().autoincrement(),
		name: varchar("name", { length: 100 }).notNull(),
		email: varchar("email", { length: 100 }).notNull().unique(),
		created_at: timestamp("created_at"),
	},
	(table) => [index("idx_interviewer_email").on(table.email)]
);
