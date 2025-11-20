import {
	createUserStats,
	getUserStats,
	updateUserStats,
} from "@/lib/drizzle/stats/stadistics";
import { enviarRespuestaIndividual } from "@/lib/providersMensajes/apiMeta/sendResponse";
import { res } from "@/utils/responseAstro";
import type { ReplyRequest } from "@/utils/types/message";
import type { ReplyMessageRequest } from "@/utils/types/providers/meta";
import { uuid } from "@/utils/uuid";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, locals }) => {
	const { env } = locals.runtime;
	const PHONE_NUMBER_ID = env.WHATSAPP_PHONE_NUMBER_ID;
	const ACCESS_TOKEN = env.WHATSAPP_ACCESS_TOKEN;

	// Validar variables de entorno
	if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
		return res(
			{ message: "Las variables de entorno no están definidas" },
			{ status: 401 }
		);
	}

	let jsonData: ReplyRequest;
	try {
		jsonData = await request.json();
	} catch (error) {
		return res(
			{ message: "JSON inválido en el cuerpo de la solicitud" },
			{ status: 400 }
		);
	}

	// Validaciones de campos requeridos
	if (!jsonData.to) {
		return res(
			{ message: "El campo 'to' (destinatario) es requerido" },
			{ status: 400 }
		);
	}

	if (!jsonData.content?.trim()) {
		return res(
			{ message: "El campo 'content' (mensaje) es requerido" },
			{ status: 400 }
		);
	}

	if (!jsonData.replyToMessageId) {
		return res(
			{ message: "El campo 'replyToMessageId' es requerido para responder" },
			{ status: 400 }
		);
	}

	try {
		// Construir el objeto ReplyMessageRequest correctamente
		const replyMessageRequest: ReplyMessageRequest = {
			messageType: "text",
			replyToMessageId: jsonData.replyToMessageId,
			content: jsonData.content,
		};

		// Enviar mensaje de respuesta
		const result = await enviarRespuestaIndividual(
			jsonData.to,
			replyMessageRequest,
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
				{ status: 400 }
			);
		}

		// Actualizar estadísticas del usuario si está autenticado
		const sessionUser = locals.user ?? null;
		const userId = (sessionUser?.id as string) ?? null;

		if (userId && result.status === "success") {
			await updateUserStatsLogic(userId);
		}

		return res(
			{
				message: "Respuesta enviada exitosamente",
				data: {
					messageId: result.messageId,
					recipient: result.recipient,
					status: result.status,
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

async function updateUserStatsLogic(userId: string) {
	const MESSAGES_SENT_COUNT = 1;
	const TIME_SAVED_PER_MESSAGE_HOURS = 0.0083; // 30 segundos en horas

	try {
		const currentStats = await getUserStats.execute({ userId });

		if (currentStats && currentStats.length > 0) {
			const stats = currentStats[0].User_stats;

			await updateUserStats(
				userId,
				(stats.totalMessagesSent ?? 0) + MESSAGES_SENT_COUNT,
				(stats.totalTimeSavedHours ?? 0) + TIME_SAVED_PER_MESSAGE_HOURS,
				stats.totalContacts, // No incrementar contactos en respuestas
				new Date() // lastUpdated
			).execute();
		} else {
			// Crear nuevo registro usando createUserStats
			await createUserStats.execute({
				id: uuid.uuid,
				userId: userId,
				totalMessagesSent: MESSAGES_SENT_COUNT,
				totalContacts: 0, // No incrementar contactos en respuestas
				totalOrders: 0,
				totalTimeSavedHours: TIME_SAVED_PER_MESSAGE_HOURS,
				lastMessageAt: new Date(),
			});
		}
	} catch (error) {
		console.error("Error actualizando estadísticas del usuario:", error);
		// No fallar la solicitud completa por error en estadísticas
	}
}
