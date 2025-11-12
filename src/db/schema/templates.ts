import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Templates = sqliteTable("Templates", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	icon: text("icon").notNull(),
	count: integer("count").default(0),
	color: text("color"),
	content: text("content").notNull(), // Contenido del mensaje
	metaTemplateId: text("metaTemplateId"),
	structure: text("structure", { mode: "json" })
		.$type<{
			header?: {
				type: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT";
				text?: string;
				example?: string;
			};
			body: {
				text: string;
				example?: string[];
			};
			footer?: {
				text: string;
			};
			buttons?: Array<{
				type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
				text: string;
				url?: string;
				phone_number?: string;
			}>;
		}>()
		.notNull(),
	variables: text("variables", { mode: "json" }).$type<{
		format: "named" | "positional";
		params: Array<{
			name: string; // Para named: "first_name", para positional: "1", "2", etc.
			placeholder: string; // Texto descriptivo: "Nombre del cliente"
			example: string;
			component: "header" | "body" | "footer";
		}>;
	}>(),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	status: text("status", { enum: ["PENDING", "APPROVED", "REJECTED"] }).default(
		"PENDING"
	),
});
