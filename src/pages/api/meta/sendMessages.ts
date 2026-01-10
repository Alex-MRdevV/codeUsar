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
		console.log("❌ Error 401: Variables de entorno no definidas");
		return res(
			{ message: "Las variables de entorno no están definidas" },
			{ status: 401 }
		);
	}

	try {
		const body = await request.json();
		console.log("📥 Body recibido:", JSON.stringify(body, null, 2));

		const { messageData, type } = body;

		// Validar que existan los campos necesarios
		if (!messageData || !type) {
			console.log("❌ Error 400: Campos faltantes", {
				hasMessageData: !!messageData,
				hasType: !!type
			});
			return res(
				{ message: "messageData y type son requeridos en el body" },
				{ status: 400 }
			);
		}

		// Validar que type sea válido
		if (type !== "template" && type !== "text") {
			console.log("❌ Error 400: Type inválido", { type });
			return res(
				{ message: "type debe ser 'template' o 'text'" },
				{ status: 400 }
			);
		}

		// Validaciones del messageData
		const validationError = validateSendMessageRequest(messageData, type);
		if (validationError) {
			console.log("❌ Error de validación:", validationError);
			return res(
				{ message: validationError.message },
				{ status: validationError.status }
			);
		}

		console.log("✅ Validaciones pasadas. Enviando mensajes...");

		// Enviar mensajes
		const [error, result] = await sendMessagesToAPI(
			messageData,
			ACCESS_TOKEN,
			PHONE_NUMBER_ID,
			20 // batchSize explícito
		);

		if (error) {
			console.log("❌ Error 500: Error al enviar mensajes", error);
			return res(
				{
					message: "Error al enviar mensajes",
					error: error.message,
				},
				{ status: 500 }
			);
		}

		console.log("📊 Resultados del envío:", {
			totalResults: result?.results.length,
			results: result?.results
		});

		// Verificar si hubo errores en los resultados
		const hasErrors = result?.results.some((item) => item.status === "error");

		if (hasErrors && result?.results.every((item) => item.status === "error")) {
			console.log("❌ Error 400: Todos los mensajes fallaron", {
				results: result?.results
			});
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

		console.log("📈 Resumen de envío:", {
			successfulMessages,
			deliveredMessages,
			hasErrors
		});

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
		console.log("❌ Error 500: Error interno del servidor", {
			error: (error as Error).message,
			stack: (error as Error).stack
		});
		return res(
			{
				message: "Error interno del servidor",
				error: (error as Error).message,
			},
			{ status: 500 }
		);
	}
};
