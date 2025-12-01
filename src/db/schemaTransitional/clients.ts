import { sql } from "drizzle-orm";
import { sqliteTable, text, check, index } from "drizzle-orm/sqlite-core";

export const Clients = sqliteTable(
	"Clients",
	{
		id: text("id", { length: 100 }).primaryKey(),
		name: text("name", { length: 100 }).notNull(),
		phone: text("phone", { length: 20 }).notNull(),
		cashless: text("cashless", { enum: ["Si", "No"] }).default("No"),
	},
	(table) => [
		check("phone_check", sql`${table.phone} = 10`),
		index("idx_phone_client").on(table.phone),
	]
);
