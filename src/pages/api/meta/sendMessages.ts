import {
	createHistory,
	historyExistsById,
	incrementMessagesSend,
} from "@/lib/drizzle/history";
import { sendMessagesToAPI } from "@/lib/providersMensajes/apiMeta/send";
import { validateSendMessageRequest } from "@/lib/providersMensajes/validateMessage";
import { res } from "@/utils/responseAstro";
import type { SendMessageRequest } from "@/utils/types/providers/meta";
import type { APIRoute } from "astro";

// Utilidad para obtener ID base del día por plantilla
function getBaseId(templateName: string): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}-${templateName}`;
}

// Genera un ID único incrementando sufijo si es necesario
async function generateUniqueId(baseId: string): Promise<string> {
	let id = baseId;
	let counter = 1;

	while (await historyExistsById(id)) {
		id = `${baseId}-${counter}`;
		counter++;
	}

	return id;
}

// Función principal de tracking
async function trackMessagesSent(
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

export const POST: APIRoute = async ({ request }) => {
	const PHONE_NUMBER_ID = import.meta.env.WHATSAPP_PHONE_ID;
	const ACCESS_TOKEN = import.meta.env.WHATSAPP_ACCESS_TOKEN;

	// Validar variables de entorno
	if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
		return res(
			{ message: "Las variables de entorno no están definidas" },
			{ status: 401 }
		);
	}

	let jsonData: SendMessageRequest;
	try {
		jsonData = await request.json();
	} catch (error) {
		return res(
			{ message: "JSON inválido en el cuerpo de la solicitud" },
			{ status: 400 }
		);
	}

	// Validaciones del request
	const validationError = validateSendMessageRequest(jsonData);
	if (validationError) return validationError;

	try {
		// Enviar mensajes
		const [error, result] = await sendMessagesToAPI(
			jsonData,
			ACCESS_TOKEN,
			PHONE_NUMBER_ID,
			20 // batchSize explícito
		);

		if (error) {
			return res(
				{
					message: "Error al enviar mensajes",
					error: error.message,
				},
				{ status: 500 }
			);
		}

		// Verificar si hubo errores en los resultados
		const hasErrors = result?.results.some((item) => item.status === "error");

		if (hasErrors && result?.results.every((item) => item.status === "error")) {
			return res(
				{
					message: "Error al enviar mensajes",
					data: {
						...result,
						summary: {
							total: result?.results.length || 0,
						},
					},
				},
				{ status: 400 }
			);
		}

		const successfulMessages =
			result?.results.filter((item) => item.status !== "error").length || 0;

		const deliveredMessages =
			result?.results.filter((item) => item.status === "success").length || 0;
		if (successfulMessages > 0) {
			// Trackear con el templateId si está disponible
			await trackMessagesSent(
				jsonData.templateId || null,
				successfulMessages,
				deliveredMessages,
				jsonData.templateName as string
			);
		}

		return res(
			{
				message: hasErrors
					? "Algunos mensajes se enviaron con errores"
					: "Mensajes enviados exitosamente",
				data: {
					...result,
					summary: {
						total: result?.results.length || 0,
						successful: successfulMessages,
						failed: (result?.results.length || 0) - successfulMessages,
					},
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		return res(
			{
				message: "Error interno del servidor",
				error: (error as Error).message,
			},
			{ status: 500 }
		);
	}
};
