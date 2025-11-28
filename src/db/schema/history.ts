import { Templates } from "@/db/schema/templates";
import { sql } from "drizzle-orm";
import {
	varchar,
	int,
	mysqlTable,
	text,
	timestamp,
	check,
	index
} from "drizzle-orm/mysql-core";

export const History = mysqlTable(
	"History",
	{
		id: varchar("id").primaryKey(),
		messagesSend: int("messagesSend").default(0),
		templateId: text("templateId").references(() => Templates.id, {
			onDelete: "set null",
		}),
		date: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => [
		check("messagesSend_positive", sql`${table.messagesSend} >= 0`),
		index("idx_history_template").on(table.templateId),
	]
);
