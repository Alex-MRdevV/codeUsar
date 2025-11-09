import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Templates = sqliteTable("Templates", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	icon: text("icon").notNull(),
	count: integer("count").default(0),
	color: text("color"),
	content: text("content").notNull(), // Contenido del mensaje
	metaTemplateId: text("metaTemplateId"),
	variables: text("variables"),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});
