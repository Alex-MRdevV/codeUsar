import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Templates = sqliteTable(
	"Templates",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull().unique(),
		icon: text("icon").notNull(),
		color: text("color"),
		// Meta Template Info
		metaStatus: text("metaStatus", {
			enum: ["PENDING", "APPROVED", "REJECTED"],
		}).default("PENDING"),
		// Content Structure - Simplificado pero completo
		headerType: text("headerType", {
			enum: ["TEXT", "IMAGE", "VIDEO", "DOCUMENT", "NONE"],
		}).default("NONE"),
		headerText: text("header_text"),
		bodyText: text("body_text").notNull(),
		footerText: text("footer_text", { length: 60 }), // Meta limita a 60 caracteres
		// Variables como JSON
		variables: text("variables", { mode: "json" }).$type<{
			type: "named" | "positional";
			list: Array<{
				key: string;
				label: string;
				example: string;
			}>;
		}>(),
		// Botones como JSON (ARRAY)
		buttons: text("buttons", { mode: "json" }).$type<
			Array<{
				type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
				text: string;
				url?: string;
				phoneNumber?: string;
			}>
		>(),
		// Métricas
		messagesSendByDay: integer("messagesSend").default(0),
		createdAt: integer("created_at", { mode: "timestamp_ms" }).default(
			sql`(unixepoch() * 1000)`
		),
		updatedAt: text("updated_at")
			.default(sql`( DATETIME('now','localtime'))`)
			.$onUpdate(() => sql`( DATETIME('now','localtime'))`),
	},
	(table) => [
		index("idx_template_status").on(table.metaStatus),
		index("idx_template_name").on(table.name),
	]
);
