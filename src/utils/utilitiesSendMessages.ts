import {
	createHistory,
	historyExistsById,
	incrementMessagesSend,
} from "@/lib/drizzle/history";

// Utilidad para obtener ID base del día por plantilla
export function getBaseId(templateName: string): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}-${templateName}`;
}

// Genera un ID único incrementando sufijo si es necesario
export async function generateUniqueId(baseId: string): Promise<string> {
	let id = baseId;
	let counter = 1;

	while (await historyExistsById(id)) {
		id = `${baseId}-${counter}`;
		counter++;
	}

	return id;
}

// Función principal de tracking
export async function trackMessagesSent(
	templateId: string | null = null,
	messageCount: number = 1,
	deliveredCount: number = 1,
	templateName: string
): Promise<void> {
	const baseId = getBaseId(templateName);

	try {
		// Verificar si ya existe registro exacto para esta plantilla
		const exactExists = await historyExistsById(baseId);

		if (exactExists) {
			// Si existe EXACTO (misma plantilla hoy, sin sufijo)
			await incrementMessagesSend(baseId, messageCount);
			return;
		}

		// Si no existe, generar ID único por si otras plantillas del día ya crearon sufijos
		const uniqueId = await generateUniqueId(baseId);

		await createHistory({
			id: uniqueId,
			messagesSend: messageCount,
			messagesAlcanzados: deliveredCount,
			templateId,
		});
	} catch (error) {}
}
