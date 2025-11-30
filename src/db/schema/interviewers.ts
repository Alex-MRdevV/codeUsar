import { sql } from "drizzle-orm";
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
		createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => [index("idx_interviewer_email").on(table.email)]
);
