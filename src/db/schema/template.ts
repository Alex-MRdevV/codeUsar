import { index, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const Templates = mysqlTable(
	"Templates",
	{
		id: varchar("id", { length: 191 }).primaryKey(),
		name: varchar("name", { length: 255 }).notNull().unique(),
		icon: varchar("icon", { length: 50 }).notNull(),
		color: varchar("color", { length: 20 }),

		// Meta Template Info
		metaTemplateId: varchar("meta_template_id", { length: 191 }),
		metaStatus: mysqlEnum("meta_status", [
			"PENDING",
			"APPROVED",
			"REJECTED",
		]).default("PENDING"),

		// Content Structure - Simplificado pero completo
		headerType: mysqlEnum("header_type", [
			"TEXT",
			"IMAGE",
			"VIDEO",
			"DOCUMENT",
			"NONE",
		]).default("NONE"),
		headerText: text("header_text"),
		bodyText: text("body_text").notNull(), 
		footerText: varchar("footer_text", { length: 60 }), // Meta limita a 60 caracteres
		// Variables y ejemplos como JSON (más simple)
		variables: json("variables").$type<{
			type: "named" | "positional"; // {{nombre}} vs {{1}}
			list: Array<{
				key: string; 
				label: string; 
				example: string; 
			}>;
		}>(),
		// Botones como JSON
		buttons: json("buttons").$type<
			Array<{
				type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
				text: string;
				url?: string;
				phoneNumber?: string;
			}>
		>(),
		// Métricas
		usageCount: int("usage_count").default(0).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
	},
	(table) => [
		index("idx_template_status").on(table.metaStatus),
		index("idx_template_name").on(table.name),
	]
);
