import { enviarRespuestaIndividual } from "@/lib/providersMensajes/callApi/sendResponse";
import { res } from "@/utils/responseAstro";
import type { ReplyMessageRequest } from "@/utils/types/providers/meta";
import type { APIRoute } from "astro";

export interface ReplyRequest {
	to: string;
	content: string;
	replyToMessageId: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
	const { env } = locals.runtime;
	const PHONE_NUMBER_ID = env.WHATSAPP_PHONE_NUMBER_ID;
	const ACCESS_TOKEN = env.WHATSAPP_ACCESS_TOKEN;

	if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
		return res(
			{
				message: "Las variables de entorno no están definidas",
			},
			{
				status: 401,
			}
		);
	}

	const jsonData: ReplyRequest = await request.json();

	// Validaciones
	if (!jsonData.to) {
		return res(
			{
				message: "El campo 'to' (destinatario) es requerido",
			},
			{
				status: 400,
			}
		);
	}

	if (!jsonData.content || jsonData.content.trim() === "") {
		return res(
			{
				message: "El campo 'content' (mensaje) es requerido",
			},
			{
				status: 400,
			}
		);
	}

	if (!jsonData.replyToMessageId) {
		return res(
			{
				message: "El campo 'replyToMessageId' es requerido para responder",
			},
			{
				status: 400,
			}
		);
	}

	try {
		const replyRequest: ReplyMessageRequest = {
			messageType: "text",
			content: jsonData.content,
			replyToMessageId: jsonData.replyToMessageId,
		};

		const result = await enviarRespuestaIndividual(
			jsonData.to,
			replyRequest,
			ACCESS_TOKEN,
			PHONE_NUMBER_ID
		);

		if (result.status === "error") {
			return res(
				{
					message: "Error al enviar respuesta",
					error: result.errorMessage,
					errorCode: result.errorCode,
				},
				{
					status: 400,
				}
			);
		}

		// Respuesta exitosa
		return res(
			{
				message: "Respuesta enviada exitosamente",
				data: {
					messageId: result.messageId,
					recipient: result.recipient,
					status: result.status,
				},
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		return res(
			{
				message: "Error interno del servidor",
				error: (error as Error).message,
			},
			{
				status: 500,
			}
		);
	}
};

