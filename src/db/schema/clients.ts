import { sql } from "drizzle-orm";
import { check, index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Clients = sqliteTable(
	"Clients",
	{
		id: text("id").primaryKey(),
		phone: text("phone").notNull(),
		document: text("document").notNull(),
		name: text("name").notNull(),
		cashless: text("cashless", { enum: ["Si", "No"] }).default("No"),
	},
	(table) => [
		index("idx_name_clients").on(table.name),
		index("idx_phone_clients").on(table.phone),
		check("phone_check_length", sql`${table.phone} = 10`),
	]
);
