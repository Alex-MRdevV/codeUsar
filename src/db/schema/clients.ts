import { sql } from "drizzle-orm";
import {
	check,
	index,
	mysqlEnum,
	mysqlTable,
	varchar,
} from "drizzle-orm/mysql-core";

export const Clients = mysqlTable(
	"Clients",
	{
		id: varchar("id", { length: 100 }).primaryKey(),
		phone: varchar("phone", { length: 20 }).notNull(),
		name: varchar("name", { length: 100 }).notNull(),
		cashless: mysqlEnum("cashless", ["Si", "No"]).default("No"),
	},
	(table) => [
		check("phone_check", sql`${table.phone} = 10`),
		index("idx_phone_client").on(table.phone),
	]
);
