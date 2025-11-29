import {
	index,
	mysqlEnum,
	mysqlTable,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";

export const User = mysqlTable(
	"User",
	{
		id: varchar("id", { length: 100 }).primaryKey(),
		name: varchar("name", { length: 191 }).notNull(),
		email: varchar("email", { length: 191 }).notNull().unique(),
		password: varchar("password", { length: 191 }).notNull(),
		createdAt: timestamp("created_at", { mode: "string" }),
	},
	(table) => [
		index("idx_user_email").on(table.email),
	]
);
