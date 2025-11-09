import { Templates } from "@/db/schema/templates";
import type { Database } from "@/utils/db";
import { eq, sql } from "drizzle-orm";

// Crear plantilla
export const createTemplate = (db: Database) =>
	db
		.insert(Templates)
		.values({
			id: sql.placeholder("id"),
			name: sql.placeholder("name"),
			icon: sql.placeholder("icon"),
			color: sql.placeholder("color"),
			content: sql.placeholder("content"),
			metaTemplateId: sql.placeholder("metaTemplateId"),
			variables: sql.placeholder("variables"),
			createdAt: sql.placeholder("createdAt"),
		})
		.prepare();

// Actualizar plantilla
export const updateTemplate = (
	db: Database,
	userId: string,
	temp: {
		name: string;
		icon: string;
		color: string;
		content: string;
		metaTemplateId: string;
		variables: string;
	}
) =>
	db
		.update(Templates)
		.set({
			name: temp.name,
			icon: temp.icon,
			color: temp.color,
			content: temp.content,
			metaTemplateId: temp.metaTemplateId,
			variables: temp.variables,
		})
		.where(eq(Templates.id, userId))
		.prepare();

// Incrementar contador de uso de plantilla
export const incrementTemplateCount = (db: Database) =>
	db
		.update(Templates)
		.set({
			count: sql`${Templates.count} + 1`,
		})
		.where(eq(Templates.id, sql.placeholder("id")))
		.prepare();
