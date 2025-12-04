import { db } from "@/db/db";
import { Templates } from "@/db/schemaTransitional/templates";
import { eq, sql } from "drizzle-orm";
import { buildUpdateSet } from "@/utils/utilities";
import { HistoryGeneral } from "@/db/schemaTransitional/history";

// Consulta para obtener datos agrupados por fecha y template
export const getCalendarDataWithTemplates = db
  .select({
    date: sql<string>`date(${HistoryGeneral.date})`,
    count: sql<number>`sum(${HistoryGeneral.messagesSend})`,
    templateId: Templates.id,
    templateName: Templates.name,
    templateColor: Templates.color,
    templateIcon: Templates.icon,
    templateMessages: sql<number>`sum(${HistoryGeneral.messagesSend})`,
  })
  .from(HistoryGeneral)
  .leftJoin(Templates, eq(HistoryGeneral.templateId, Templates.id))
  .where(eq(Templates.metaStatus, "APPROVED"))
  .groupBy(
    sql`date(${HistoryGeneral.date})`,
    Templates.id,
    Templates.name,
    Templates.color,
    Templates.icon
  )
  .orderBy(sql`date(${HistoryGeneral.date})`)
  .prepare();

export const createTemplate = db
	.insert(Templates)
	.values({
		id: sql.placeholder("id"),
		name: sql.placeholder("name"),
		icon: sql.placeholder("icon"),
		color: sql.placeholder("color"),
		metaStatus: sql.placeholder("metaStatus"),
		headerType: sql.placeholder("headerType"),
		headerText: sql.placeholder("headerText"),
		bodyText: sql.placeholder("bodyText"),
		footerText: sql.placeholder("footerText"),
		variables: sql.placeholder("variables"),
		buttons: sql.placeholder("buttons"),
	})
	.prepare();

export const getTemplates = db
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

// Nueva consulta para datos del heatmap con información completa
export const getDataForDaysWithTemplates = db
  .select({
    date: sql<string>`DATE(${HistoryGeneral.date})`,
    count: sql<number>`COALESCE(SUM(${HistoryGeneral.messagesSend}), 0)`,
    templateId: Templates.id,
    templateName: Templates.name,
    templateColor: Templates.color,
    templateIcon: Templates.icon,
  })
  .from(HistoryGeneral)
  .leftJoin(Templates, eq(HistoryGeneral.templateId, Templates.id))
  .where(eq(Templates.metaStatus, "APPROVED"))
  .groupBy(
    sql`DATE(${HistoryGeneral.date})`,
    Templates.id,
    Templates.name,
    Templates.color,
    Templates.icon
  )
  .orderBy(sql`DATE(${HistoryGeneral.date}) DESC`)
  .prepare();

// Consulta adicional para obtener números únicos por día
export const getUniqueNumbersByDay = db
  .select({
    date: sql<string>`DATE(${HistoryGeneral.date})`,
    uniqueNumbers: sql<number>`COUNT(DISTINCT ${HistoryGeneral.phoneNumber})`,
  })
  .from(HistoryGeneral)
  .leftJoin(Templates, eq(HistoryGeneral.templateId, Templates.id))
  .where(eq(Templates.metaStatus, "APPROVED"))
  .groupBy(sql`DATE(${HistoryGeneral.date})`)
  .prepare();

export const getTemplatesForMetrics = db
	.select({
		id: Templates.id,
		name: Templates.name,
		icon: Templates.icon,
		color: Templates.color,
		status: Templates.metaStatus,
		messagesSent: sql<number>`COALESCE(SUM(${HistoryGeneral.messagesSend}), 0)`,
	})
	.from(Templates)
	.leftJoin(HistoryGeneral, eq(HistoryGeneral.templateId, Templates.id))
	.where(eq(Templates.metaStatus, "APPROVED"))
	.groupBy(Templates.id)
	.prepare();

export const updateTemplate = (
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
