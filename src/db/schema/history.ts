import { Templates } from "@/db/schema/templates";
import { sql } from "drizzle-orm";
import {
	check,
	index,
	integer,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

export const History = sqliteTable(
	"History",
	{
		id: text("id").primaryKey(),
		messagesSend: integer("messagesSend").default(0),
		templateId: text("templateId").references(() => Templates.id, {
			onDelete: "set null",
		}),
		date: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
	},
	(table) => [
		check("messagesSend_positive", sql`${table.messagesSend} >= 0`),
		index("idx_history_template").on(table.templateId),
	]
);
