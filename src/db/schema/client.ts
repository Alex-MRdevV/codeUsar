import { sql } from "drizzle-orm";
import { mysqlEnum, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const Client = mysqlTable(
	"Client",
	{
		id: varchar("id", { length: 100 }).primaryKey(),
		phone: varchar("phone", { length: 20 }).notNull(),
		document: varchar("document", { length: 20 }).notNull(),
		name: varchar("name", { length: 100 }).notNull(),
		cashless: mysqlEnum("cashless", ["Si", "No"]).default("No"),
	},
	(table) => ({
		phoneCheck: sql`CONSTRAINT phone_check CHECK (CHAR_LENGTH(${table.phone}) = 10 AND phone REGEXP '^[0-9]+$')`,
	})
);
