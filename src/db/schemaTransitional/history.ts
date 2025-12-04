import { Templates } from "@/db/schemaTransitional/templates";
import { sql } from "drizzle-orm";
import {
	check,
	index,
	integer,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

export const HistoryGeneral = sqliteTable(
	"HistoryGeneral",
	{
		id: text("id").primaryKey(),
		messagesSend: integer("messagesSend").default(0),
		phoneNumber: text("phoneNumber", { length: 20 }),
		templateId: text("templateId", { length: 100 }).references(
			() => Templates.id,
			{
				onDelete: "set null",
			}
		),
		date: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => [
		check("messagesSend_positive", sql`${table.messagesSend} >= 0`),
		index("idx_history_template").on(table.templateId),
	]
);
