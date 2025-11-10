// src/pages/api/messages/reply.ts

import type { APIRoute } from "astro";
import { res } from "@/utils/responseAstro";
import { buildMetaRequest } from "@/lib/providersMensajes/sendMessages";
import { urlEnviarMensajeTexto } from "@/lib/providersMensajes/metaUrls";
import type { SendMessageRequest } from "@/utils/types/providers/meta";

interface ReplyRequest {
	messageId: string; // ID del mensaje original (para tracking/logs)
	to: string; // Número del destinatario
	content: string; // Texto de la respuesta
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

	try {
		const sendRequest: SendMessageRequest = {
			recipients: [jsonData.to],
			messageType: "text",
			content: jsonData.content,
		};

		const metaRequest = buildMetaRequest(jsonData.to, sendRequest);
		const url = urlEnviarMensajeTexto(PHONE_NUMBER_ID);

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${ACCESS_TOKEN}`,
			},
			body: JSON.stringify(metaRequest),
		});

		const data = await response.json();

		if (!response.ok) {
			return res(
				{
					message: "Error al enviar respuesta",
					error: data.error?.message || "Error desconocido",
					errorCode: data.error?.code,
				},
				{
					status: response.status,
				}
			);
		}

		// Respuesta exitosa
		return res(
			{
				message: "Respuesta enviada exitosamente",
				data: {
					messageId: data.messages?.[0]?.id,
					recipient: jsonData.to,
					status: "success",
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
