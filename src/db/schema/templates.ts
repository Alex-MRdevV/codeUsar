import { sql } from "drizzle-orm";
import {
	index,
	int,
	json,
	mysqlEnum,
	mysqlTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";

export const Templates = mysqlTable(
	"Templates",
	{
		id: varchar("id", { length: 100 }).primaryKey(),
		name: varchar("name", { length: 255 }).notNull().unique(),
		icon: varchar("icon", { length: 50 }).notNull(),
		color: varchar("color", { length: 20 }),
		// Meta Template Info
		metaTemplateId: varchar("metaTemplateId", { length: 191 }),
		metaStatus: mysqlEnum("metaStatus", [
			"PENDING",
			"APPROVED",
			"REJECTED",
		]).default("PENDING"),
		// Content Structure - Simplificado pero completo
		headerType: mysqlEnum("headerType", [
			"TEXT",
			"IMAGE",
			"VIDEO",
			"DOCUMENT",
			"NONE",
		]).default("NONE"),
		headerText: text("headerText"),
		bodyText: text("bodyText").notNull(),
		footerText: varchar("footerText", { length: 60 }), // Meta limita a 60 caracteres
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
		dailyMessageCount: int("dailyMessageCount").default(0).notNull(),
		createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
		updatedAt: timestamp("updatedAt")
			.default(sql`CURRENT_TIMESTAMP`)
			.onUpdateNow(),
	},
	(table) => [
		index("idx_template_status").on(table.metaStatus),
		index("idx_template_name").on(table.name),
	]
);
