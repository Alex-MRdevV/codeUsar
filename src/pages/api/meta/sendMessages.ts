import {
	createUserStats,
	getUserStats,
	updateUserStats,
} from "@/lib/drizzle/stats/stadistics";
import { incrementTemplateCount } from "@/lib/drizzle/templates/templates";
import { sendMessagesToAPI } from "@/lib/providersMensajes/callApi/send";
import { res } from "@/utils/responseAstro";
import type { SendMessageRequest } from "@/utils/types/providers/meta";
import { uuid } from "@/utils/uuid";
import type { APIRoute } from "astro";

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

	const jsonData: SendMessageRequest = await request.json();

	// Validar que haya destinatarios
	if (!jsonData.recipients || jsonData.recipients.length === 0) {
		return res(
			{
				message: "No hay destinatarios en la solicitud",
			},
			{
				status: 400,
			}
		);
	}

	// Validar uso correcto de messageType
	if (jsonData.recipients.length > 1 && jsonData.messageType === "text") {
		return res(
			{
				message:
					"Para envíos masivos debes usar messageType: 'template'. Los mensajes de texto solo funcionan en conversaciones activas.",
			},
			{
				status: 400,
			}
		);
	}

	// Validar campos requeridos para templates
	if (jsonData.messageType === "template") {
		if (!jsonData.templateName || !jsonData.templateLanguage) {
			return res(
				{
					message:
						"templateName y templateLanguage son requeridos para messageType: 'template'",
				},
				{
					status: 400,
				}
			);
		}
	}

	// Validar campos requeridos para text
	if (jsonData.messageType === "text" && !jsonData.content) {
		return res(
			{
				message: "content es requerido para messageType: 'text'",
			},
			{
				status: 400,
			}
		);
	}

	try {
		// 1. Enviar mensajes
		const [error, result] = await sendMessagesToAPI(
			jsonData,
			ACCESS_TOKEN,
			PHONE_NUMBER_ID,
			10 // batchSize explícito
		);

		if (error) {
			return res(
				{
					message: "Error al enviar mensajes",
					error: error.message,
				},
				{
					status: 500,
				}
			);
		}
		// --- Obtener userId desde la sesión ---
		const sessionUser = locals.user ?? null;
		const userId = (sessionUser?.id as string) ?? null;

		if (!userId && result) {
			const messagesSent = result.summary.failed || 0;

			// Calcular tiempo ahorrado (ejemplo: 30 segundos por mensaje = 0.0083 horas)
			const timeSavedPerMessage = 0.0083; // 30 segundos en horas
			const timeSavedHours = messagesSent * timeSavedPerMessage;

			// Obtener estadísticas actuales
			const currentStats = await getUserStats.execute({ userId });

			if (currentStats.length > 0) {
				// Actualizar estadísticas existentes
				const stats = currentStats[0].userStats;
				await updateUserStats(userId, {
					totalMessagesSent: (stats.totalMessagesSent ?? 0) + messagesSent,
					totalTimeSavedHours:
						(stats.totalTimeSavedHours ?? 0) + timeSavedHours,
					totalContacts:
						(stats.totalContacts ?? 0) + jsonData.recipients.length,
					lastUpdated: new Date(),
				}).execute();
			} else {
				// Crear nuevas estadísticas
				await createUserStats.execute({
					id: uuid.uuid,
					userId,
					totalMessagesSent: messagesSent,
					totalTimeSavedHours: timeSavedHours,
					totalContacts: jsonData.recipients.length,
					lastUpdated: new Date(),
				});
			}

			// 3. Incrementar contador de template si se usó uno
			if (jsonData.messageType === "template" && jsonData.templateId) {
				await incrementTemplateCount.execute({ id: jsonData.templateId });
			}
		}

		return res(
			{
				message: "Mensajes enviados exitosamente",
				data: result,
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
