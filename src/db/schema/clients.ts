import { sql } from "drizzle-orm";
import {
	check,
	index,
	mysqlEnum,
	mysqlTable,
	varchar,
} from "drizzle-orm/mysql-core";

export const Client = mysqlTable(
	"Client",
	{
		id: varchar("id", { length: 100 }).primaryKey(),
		name: varchar("name", { length: 100 }).notNull(),
		phone: varchar("phone", { length: 20 }).notNull(),
		document: varchar("document", { length: 20 }).notNull(),
		cashless: mysqlEnum("cashless", ["Si", "No"]).default("No"),
	},
	(table) => [
		check("phone_check", sql`${table.phone} = 0`),
		index("idx_phone_client").on(table.phone),
	]
);

