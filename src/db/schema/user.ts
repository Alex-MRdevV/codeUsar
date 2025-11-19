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
		id: varchar("id", { length: 191 }).primaryKey(),
		name: varchar("name", { length: 191 }).notNull(),
		email: varchar("email", { length: 191 }).notNull().unique(),
		status: mysqlEnum("status", ["activo", "retirado"]).default("activo"),
		createdAt: timestamp("created_at", { mode: "string" }),
	},
	(table) => [
		index("idx_user_status").on(table.status),
		index("idx_user_email").on(table.email),
	]
);
