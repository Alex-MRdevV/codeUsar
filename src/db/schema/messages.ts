import { Clients } from "@/db/schema/clients";
import { Templates } from "@/db/schema/templates";
import { User } from "@/db/schema/users";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Messages = sqliteTable(
	"Messages",
	{
		id: text("id").primaryKey(),
		userId: text("userId")
			.notNull()
			.references(() => User.id, { onDelete: "cascade" }),
		templateId: text("templateId").references(() => Templates.id, {
			onDelete: "set null",
		}),
		clientId: text("clientId").references(() => Clients.id, {
			onDelete: "set null",
		}),
		status: text("status", {
			enum: ["enviado", "entregado", "leido", "fallido"],
		}).default("enviado"),
		sentAt: integer("sentAt", { mode: "timestamp" }).notNull(),
		readAt: integer("readAt", { mode: "timestamp" }),
	},
	(table) => [
		index("userId_idx").on(table.userId),
		index("sentAt_idx").on(table.sentAt),
		index("status_idx").on(table.status),
	]
);
