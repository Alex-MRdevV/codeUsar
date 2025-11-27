import { type Database } from "@/db/db";
import { Templates } from "@/db/schema/templates";
import { eq, sql } from "drizzle-orm";
import { buildUpdateSet } from "@/utils/updateUtilities";

export const createTemplate = (db: Database) =>
	db
		.insert(Templates)
		.values({
			id: sql.placeholder("id"),
			name: sql.placeholder("name"),
			icon: sql.placeholder("icon"),
			color: sql.placeholder("color"),
			metaStatus: sql.placeholder("metaStatus"),
			metaTemplateId: sql.placeholder("metaTemplateId"),
			headerType: sql.placeholder("headerType"),
			headerText: sql.placeholder("headerText"),
			bodyText: sql.placeholder("bodyText"),
			footerText: sql.placeholder("footerText"),
			variables: sql.placeholder("variables"),
			buttons: sql.placeholder("buttons"),
			usageCount: "",
		})
		.prepare();

export const getTemplates = (db: Database) =>
	db
		.select({
			id: Templates.id,
			name: Templates.name,
			language: sql<string>`'es'`,
			headerType: Templates.headerType,
			headerText: Templates.headerText,
			bodyText: Templates.bodyText,
			footerText: Templates.footerText,
			variables: Templates.variables,
			buttons: Templates.buttons,
		})
		.from(Templates)
		.where(eq(Templates.metaStatus, "APPROVED"))
		.prepare();

export const getTemplatesForHistory = (db: Database) =>
	db
		.select({
			id: Templates.id,
			name: Templates.name,
			icon: Templates.icon,
			color: Templates.color,
			count: Templates.usageCount,
		})
		.from(Templates)
		.where(eq(Templates.metaStatus, "APPROVED"))
		.prepare();

export const updateTemplate = (
	db: Database,
	idTemplate: string,
	temp: {
		name?: string;
		icon?: string;
		color?: string;

		metaTemplateId?: string;
		metaStatus?: "PENDING" | "APPROVED" | "REJECTED";

		headerType?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT" | "NONE";
		headerText?: string;
		bodyText?: string;
		footerText?: string;

		variables?: {
			type: "named" | "positional";
			list: Array<{
				key: string;
				label: string;
				example: string;
			}>;
		};

		buttons?: Array<{
			type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
			text: string;
			url?: string;
			phoneNumber?: string;
		}>;
	}
) =>
	db
		.update(Templates)
		.set(buildUpdateSet(temp))
		.where(eq(Templates.id, idTemplate))
		.prepare();

export const incrementTemplateCount = (db: Database) =>
	db
		.update(Templates)
		.set({
			usageCount: sql`${Templates.usageCount} + 1`,
		})
		.where(eq(Templates.id, sql.placeholder("id")))
		.prepare();
