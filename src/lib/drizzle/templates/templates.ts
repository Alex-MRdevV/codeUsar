import { Templates } from "@/db/schema/templates";
import { db } from "@/lib/db";
import type { Database } from "@/utils/db";
import { eq, sql } from "drizzle-orm";

// Crear plantilla
export const createTemplate = db
	.insert(Templates)
	.values({
		id: sql.placeholder("id"),
		name: sql.placeholder("name"),
		icon: sql.placeholder("icon"),
		color: sql.placeholder("color"),
		content: sql.placeholder("content"),
		metaTemplateId: sql.placeholder("metaTemplateId"),
		structure: sql.placeholder("structure"),
		variables: sql.placeholder("variables"),
		createdAt: sql.placeholder("createdAt"),
		status: sql.placeholder("status"), // Añadido también el status
	})
	.prepare();

// Añade esta consulta preparada donde tienes createTemplate
export const getTemplates = db
	.select({
		id: Templates.id,
		name: Templates.name,
		metaTemplateName: Templates.metaTemplateId, // o el campo correcto si tienes el nombre
		language: sql<string>`'es'`, // ajusta según tu lógica
		structure: Templates.structure,
		variables: Templates.variables,
	})
	.from(Templates)
	.where(eq(Templates.status, "APPROVED"))
	.prepare();

export const getTemplatesForHistory = db
	.select({
		id: Templates.id,
		name: Templates.name,
		icon: Templates.icon,
		count: Templates.count,
		color: Templates.color,
	})
	.from(Templates)
	.where(eq(Templates.status, "APPROVED"))
	.prepare();

// Actualizar plantilla
export const updateTemplate = (
	idTemplate: string,
	temp: {
		name: string;
		icon: string;
		color: string;
		content: string;
		metaTemplateId: string;
		structure: {
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
		};
		variables?: {
			format: "named" | "positional";
			params: Array<{
				name: string;
				placeholder: string;
				example: string;
				component: "header" | "body" | "footer";
			}>;
		};
		status?: "PENDING" | "APPROVED" | "REJECTED";
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
			structure: temp.structure,
			variables: temp.variables,
			...(temp.status && { status: temp.status }),
		})
		.where(eq(Templates.id, idTemplate))
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
