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
		name: varchar("name", { length: 100 }).notNull(),
		phone: varchar("phone", { length: 20 }).notNull(),
<<<<<<< HEAD
		name: varchar("name", { length: 100 }).notNull(),
=======
		document: varchar("document", { length: 20 }).notNull(),
>>>>>>> 85de8590700aee9dd58678a32c162882d7dbc947
		cashless: mysqlEnum("cashless", ["Si", "No"]).default("No"),
	},
	(table) => [
		check("phone_check", sql`${table.phone} = 10`),
		index("idx_phone_client").on(table.phone),
	]
);

