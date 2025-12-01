import { db } from "@/db/db";
import { HistoryGeneral } from "@/db/schemaTransitional/history";
import { eq, desc, and, gte, lte, isNull, isNotNull, sql } from "drizzle-orm";

// ============================================
// CREAR (CREATE)
// ============================================

export async function createHistory(data: {
	id: string;
	messagesSend?: number;
	templateId?: string | null;
}) {
	const [result] = await db
		.insert(HistoryGeneral)
		.values({
			id: data.id,
			messagesSend: data.messagesSend ?? 0,
			templateId: data.templateId ?? null,
		})
		.returning();

	return result;
}

/**
 * Crear múltiples registros de historial en batch
 */
export async function createHistoryBatch(
	records: Array<{
		id: string;
		messagesSend?: number;
		templateId?: string | null;
	}>
) {
	const results = await db
		.insert(HistoryGeneral)
		.values(
			records.map((r) => ({
				id: r.id,
				messagesSend: r.messagesSend ?? 0,
				templateId: r.templateId ?? null,
			}))
		)
		.returning();

	return results;
}

// ============================================
// LEER (READ)
// ============================================

/**
 * Obtener un registro por ID
 */
export async function getHistoryById(id: string) {
	const [result] = await db
		.select()
		.from(HistoryGeneral)
		.where(eq(HistoryGeneral.id, id))
		.limit(1);

	return result ?? null;
}

/**
 * Obtener registros por templateId
 */
export async function getHistoryByTemplate(templateId: string) {
	return await db
		.select()
		.from(HistoryGeneral)
		.where(eq(HistoryGeneral.templateId, templateId))
		.orderBy(desc(HistoryGeneral.date));
}

/**
 * Obtener registros sin template asignado
 */
export async function getHistoryWithoutTemplate() {
	return await db
		.select()
		.from(HistoryGeneral)
		.where(isNull(HistoryGeneral.templateId))
		.orderBy(desc(HistoryGeneral.date));
}

/**
 * Obtener registros por rango de fechas
 */
export async function getHistoryByDateRange(
	startDate: string,
	endDate: string
) {
	return await db
		.select()
		.from(HistoryGeneral)
		.where(
			and(
				gte(HistoryGeneral.date, startDate),
				lte(HistoryGeneral.date, endDate)
			)
		)
		.orderBy(desc(HistoryGeneral.date));
}

/**
 * Contar registros totales
 */
export async function countHistory(templateId?: string) {
	const conditions = templateId
		? eq(HistoryGeneral.templateId, templateId)
		: undefined;

	const [result] = await db
		.select({ count: sql<number>`count(*)` })
		.from(HistoryGeneral)
		.where(conditions);

	return result.count;
}

// ============================================
// ACTUALIZAR (UPDATE)
// ============================================

/**
 * Actualizar un registro completo
 */
export async function updateHistory(
	id: string,
	data: {
		messagesSend?: number;
		templateId?: string | null;
	}
) {
	const [result] = await db
		.update(HistoryGeneral)
		.set(data)
		.where(eq(HistoryGeneral.id, id))
		.returning();

	return result ?? null;
}

/**
 * Incrementar el contador de mensajes enviados
 */
export async function incrementMessagesSend(id: string, amount: number = 1) {
	const [result] = await db
		.update(HistoryGeneral)
		.set({
			messagesSend: sql`${HistoryGeneral.messagesSend} + ${amount}`,
		})
		.where(eq(HistoryGeneral.id, id))
		.returning();

	return result ?? null;
}

/**
 * Decrementar el contador de mensajes enviados
 */
export async function decrementMessagesSend(id: string, amount: number = 1) {
	const [result] = await db
		.update(HistoryGeneral)
		.set({
			messagesSend: sql`MAX(0, ${HistoryGeneral.messagesSend} - ${amount})`,
		})
		.where(eq(HistoryGeneral.id, id))
		.returning();

	return result ?? null;
}

/**
 * Actualizar el templateId
 */
export async function updateTemplateId(id: string, templateId: string | null) {
	const [result] = await db
		.update(HistoryGeneral)
		.set({ templateId })
		.where(eq(HistoryGeneral.id, id))
		.returning();

	return result ?? null;
}

/**
 * Resetear mensajes enviados a 0
 */
export async function resetMessagesSend(id: string) {
	const [result] = await db
		.update(HistoryGeneral)
		.set({ messagesSend: 0 })
		.where(eq(HistoryGeneral.id, id))
		.returning();

	return result ?? null;
}

/**
 * Actualizar múltiples registros por templateId
 */
export async function updateByTemplate(
	templateId: string,
	data: {
		messagesSend?: number;
	}
) {
	const results = await db
		.update(HistoryGeneral)
		.set(data)
		.where(eq(HistoryGeneral.templateId, templateId))
		.returning();

	return results;
}

/**
 * Eliminar un registro por ID
 */
export async function deleteHistory(id: string) {
	const [result] = await db
		.delete(HistoryGeneral)
		.where(eq(HistoryGeneral.id, id))
		.returning();

	return result ?? null;
}

/**
 * Eliminar múltiples registros por IDs
 */
export async function deleteHistoryBatch(ids: string[]) {
	const results = await db
		.delete(HistoryGeneral)
		.where(sql`${HistoryGeneral.id} IN ${ids}`)
		.returning();

	return results;
}

/**
 * Eliminar todos los registros de un template
 */
export async function deleteHistoryByTemplate(templateId: string) {
	const results = await db
		.delete(HistoryGeneral)
		.where(eq(HistoryGeneral.templateId, templateId))
		.returning();

	return results;
}

/**
 * Eliminar registros antiguos (por fecha)
 */
export async function deleteHistoryBeforeDate(date: string) {
	const results = await db
		.delete(HistoryGeneral)
		.where(lte(HistoryGeneral.date, date))
		.returning();

	return results;
}

// ============================================
// OPERACIONES ESTADÍSTICAS
// ============================================

export async function getTotalMessagesSent(templateId?: string) {
	const conditions = templateId
		? eq(HistoryGeneral.templateId, templateId)
		: undefined;

	const [result] = await db
		.select({
			total: sql<number>`COALESCE(SUM(${HistoryGeneral.messagesSend}), 0)`,
		})
		.from(HistoryGeneral)
		.where(conditions);

	return result.total;
}

export async function getStatsByTemplate() {
	return await db
		.select({
			templateId: HistoryGeneral.templateId,
			count: sql<number>`count(*)`,
			totalMessages: sql<number>`SUM(${HistoryGeneral.messagesSend})`,
			avgMessages: sql<number>`AVG(${HistoryGeneral.messagesSend})`,
		})
		.from(HistoryGeneral)
		.where(isNotNull(HistoryGeneral.templateId))
		.groupBy(HistoryGeneral.templateId);
}

export async function historyExists(id: string): Promise<boolean> {
	const [result] = await db
		.select({ id: HistoryGeneral.id })
		.from(HistoryGeneral)
		.where(eq(HistoryGeneral.id, id))
		.limit(1);

	return !!result;
}
