import { Templates } from "@/db/schemaTransitional/templates";
import { sql } from "drizzle-orm";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const MessageHistory = sqliteTable(
	"MessageHistory",
	{
		id: text("id").primaryKey(),
		templateId: text("templateId", { length: 100 }).references(
			() => Templates.id,
			{ onDelete: "set null" }
		),
		phone: text("phone").notNull(), // Número destino
		status: text("status", {
			enum: ["Pendiente", "Entregado", "Fallado"],
		}).default("Pendiente"),
		failureReason: text("failureReason"),
		sendDate: text("send_date").default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => [
		index("idx_history_template_date").on(table.templateId, table.sendDate),
		index("idx_history_status").on(table.status),
		index("idx_history_phone").on(table.phone),
	]
);
