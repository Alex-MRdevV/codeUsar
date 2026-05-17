import { sendMessagesToAPI } from "@/lib/providersMensajes/apiMeta/send";
import { validateSendMessageRequest } from "@/lib/providersMensajes/validateMessage";
import { res } from "@/utils/responseAstro";
import { trackMessagesSent } from "@/utils/utilitiesSendMessages";
import type { APIRoute } from "astro";

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

	try {
		const body = await request.json();
		const { messageData, type } = body;

		// Validar que existan los campos necesarios
		if (!messageData || !type) {
			return res(
				{ message: "messageData y type son requeridos en el body" },
				{ status: 400 }
			);
		}

		// Validar que type sea válido
		if (type !== "template" && type !== "text") {
			return res(
				{ message: "type debe ser 'template' o 'text'" },
				{ status: 400 }
			);
		}

		// Validaciones del messageData
		const validationError = validateSendMessageRequest(messageData, type);
		if (validationError) {
			return res(
				{ message: validationError.message },
				{ status: validationError.status }
			);
		}

		// Enviar mensajes
		const [error, result] = await sendMessagesToAPI(
			messageData,
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
				messageData.templateId || null,
				successfulMessages,
				deliveredMessages,
				messageData.templateName as string
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
