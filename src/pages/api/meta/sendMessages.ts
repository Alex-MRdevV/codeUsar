import {
	createHistory,
	historyExists,
	incrementMessagesSend,
} from "@/lib/drizzle/history";
import { sendMessagesToAPI } from "@/lib/providersMensajes/apiMeta/send";
import { validateSendMessageRequest } from "@/lib/providersMensajes/validateMessage";
import { res } from "@/utils/responseAstro";
import type { SendMessageRequest } from "@/utils/types/providers/meta";
import type { APIRoute } from "astro";

// Utilidad para obtener el ID del día actual
function getTodayId(): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

// Función para trackear mensajes enviados
async function trackMessagesSent(
	templateId: string | null = null,
	messageCount: number = 1
): Promise<void> {
	const todayId = getTodayId();

	try {
		// Verificar si ya existe un registro para hoy
		const exists = await historyExists(todayId);

		if (exists) {
			// Si existe, incrementar el contador
			await incrementMessagesSend(todayId, messageCount);
		} else {
			// Si no existe, crear un nuevo registro
			await createHistory({
				id: todayId,
				messagesSend: messageCount,
				templateId: templateId,
			});
		}
	} catch (error) {}
}

export const POST: APIRoute = async ({ request, locals }) => {
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
			15 // batchSize explícito
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
			console.log(result);
			// Todos los mensajes fallaron
			return res(
				{
					message: "Error al enviar mensajes",
					error: "Todos los mensajes fallaron al enviarse",
				},
				{ status: 400 }
			);
		}

		// ✅ REGISTRAR EN EL HISTORIAL
		// Contar mensajes enviados exitosamente
		const successfulMessages =
			result?.results.filter((item) => item.status !== "error").length || 0;

		if (successfulMessages > 0) {
			// Trackear con el templateId si está disponible
			await trackMessagesSent(jsonData.templateId || null, successfulMessages);
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
