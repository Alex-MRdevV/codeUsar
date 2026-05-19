import { sendMessagesToAPI } from "@/lib/providersMensajes/apiMeta/send";
import { validateSendMessageRequest } from "@/lib/providersMensajes/validateMessage";
import { res } from "@/utils/responseAstro";
import { trackMessagesSent } from "@/utils/utilitiesSendMessages";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
	const PHONE_NUMBER_ID = import.meta.env.WHATSAPP_PHONE_ID;
	const ACCESS_TOKEN = import.meta.env.WHATSAPP_ACCESS_TOKEN;

	console.log(" PHONE_NUMBER_ID:", PHONE_NUMBER_ID);
	console.log(
		" ACCESS_TOKEN:",
		ACCESS_TOKEN ? "EXISTE ✅" : "NO EXISTE ❌"
	);

	// Validar variables de entorno
	if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
		console.error("❌ Variables de entorno faltantes");

		return res(
			{ message: "Las variables de entorno no están definidas" },
			{ status: 401 }
		);
	}

	try {
		const body = await request.json();

		console.log("📥 BODY RECIBIDO:", JSON.stringify(body, null, 2));

		const { messageData, type } = body;

		// Validar que existan los campos necesarios
		if (!messageData || !type) {
			console.error("❌ messageData o type faltantes");

			return res(
				{ message: "messageData y type son requeridos en el body" },
				{ status: 400 }
			);
		}

		console.log("📌 TYPE:", type);
		console.log(
			"📌 messageData:",
			JSON.stringify(messageData, null, 2)
		);

		// Validar que type sea válido
		if (type !== "template" && type !== "text") {
			console.error("❌ Type inválido:", type);

			return res(
				{ message: "type debe ser 'template' o 'text'" },
				{ status: 400 }
			);
		}

		// Validaciones del messageData
		const validationError = validateSendMessageRequest(messageData, type);

		if (validationError) {
			console.error("❌ Error validando messageData:", validationError);

			return res(
				{ message: validationError.message },
				{ status: validationError.status }
			);
		}

		console.log("🚀 Enviando mensajes a Meta...");

		// Enviar mensajes
		const [error, result] = await sendMessagesToAPI(
			messageData,
			ACCESS_TOKEN,
			PHONE_NUMBER_ID,
			20
		);

		console.log("📤 RESULTADO API:");
		console.log(JSON.stringify(result, null, 2));

		if (error) {
			console.error("❌ ERROR sendMessagesToAPI:");
			console.error(error);

			return res(
				{
					message: "Error al enviar mensajes",
					error: error.message,
				},
				{ status: 500 }
			);
		}

		// Verificar si hubo errores en los resultados
		const hasErrors = result?.results.some(
			(item) => item.status === "error"
		);

		console.log("📊 hasErrors:", hasErrors);

		if (
			hasErrors &&
			result?.results.every((item) => item.status === "error")
		) {
			console.error("❌ Todos los mensajes fallaron");
			console.error(JSON.stringify(result.results, null, 2));

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

		console.log("✅ successfulMessages:", successfulMessages);
		console.log("✅ deliveredMessages:", deliveredMessages);

		if (successfulMessages > 0) {
			console.log("📈 Trackeando mensajes enviados...");

			await trackMessagesSent(
				messageData.templateId || null,
				successfulMessages,
				deliveredMessages,
				(messageData.templateName as string) || "texto_libre"
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
						failed:
							(result?.results.length || 0) -
							successfulMessages,
					},
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("🔥 ERROR GENERAL:");
		console.error(error);

		return res(
			{
				message: "Error interno del servidor",
				error: (error as Error).message,
			},
			{ status: 500 }
		);
	}
};