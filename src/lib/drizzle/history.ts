import { db } from "@/db/db";
import { HistoryGeneral } from "@/db/schemaTransitional/history";
import { eq, sql } from "drizzle-orm";

export async function createHistory(data: {
	id: string;
	messagesSend?: number;
	templateId?: string | null;
	messagesAlcanzados: number
}) {
	const [result] = await db
		.insert(HistoryGeneral)
		.values({
			id: data.id,
			messagesSend: data.messagesSend ?? 0,
			templateId: data.templateId ?? null,
			messagesAlcanzados: data.messagesAlcanzados,
		})
		.returning();

	return result;
}

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

export async function historyExists(id: string): Promise<boolean> {
	const [result] = await db
		.select({ id: HistoryGeneral.id })
		.from(HistoryGeneral)
		.where(eq(HistoryGeneral.id, id))
		.limit(1);

	return !!result;
}
