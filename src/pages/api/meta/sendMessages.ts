import { sendMessagesToAPI } from "@/lib/providersMensajes/apiMeta/send";
import { validateSendMessageRequest } from "@/lib/providersMensajes/validateMessage";
import { res } from "@/utils/responseAstro";
import type { SendMessageRequest } from "@/utils/types/providers/meta";
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
