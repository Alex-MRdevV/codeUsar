/*import {
	createUserStats,
	getUserStats,
	updateUserStats,
} from "@/lib/drizzle/stats/stadistics";*/
//import { incrementTemplateCount } from "@/lib/drizzle/templates/templates";
import { sendMessagesToAPI } from "@/lib/providersMensajes/apiMeta/send";
import { res } from "@/utils/responseAstro";
import type { SendMessageRequest } from "@/utils/types/providers/meta";
import { uuid } from "@/utils/uuid";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, locals }) => {
	const { env } = locals.runtime;
	const PHONE_NUMBER_ID = env.WHATSAPP_PHONE_ID;
	const ACCESS_TOKEN = env.WHATSAPP_ACCESS_TOKEN;
	//const user = await locals.currentUser();
	//if (!user) return res({ message: "NO existe el usuario" }, { status: 403 });

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
			10 // batchSize explícito
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

		if (result?.results.map((item) => item.status === "error")) {
			return res(
				{
					message: "Error al enviar mensajes",
					error: "Algo ha fallado al enviar el mensaje",
				},
				{ status: 400 }
			);
		}

		/*if (user.id && result) {
			await updateUserStatistics(user.id, jsonData, result);
		}*/

		return res(
			{
				message: "Mensajes enviados exitosamente",
				data: result,
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

// Funciones auxiliares
function validateSendMessageRequest(data: SendMessageRequest) {
	// Validar destinatarios
	if (!data.recipients?.length) {
		return res(
			{ message: "No hay destinatarios en la solicitud" },
			{ status: 400 }
		);
	}

	// Validar uso correcto de messageType para envíos masivos
	if (data.recipients.length > 1 && data.messageType === "text") {
		return res(
			{
				message:
					"Para envíos masivos debes usar messageType: 'template'. Los mensajes de texto solo funcionan en conversaciones activas.",
			},
			{ status: 400 }
		);
	}

	// Validar campos requeridos para templates
	if (data.messageType === "template") {
		if (!data.templateName || !data.templateLanguage) {
			return res(
				{
					message:
						"templateName y templateLanguage son requeridos para messageType: 'template'",
				},
				{ status: 400 }
			);
		}
	}

	// Validar campos requeridos para text
	if (data.messageType === "text" && !data.content) {
		return res(
			{ message: "content es requerido para messageType: 'text'" },
			{ status: 400 }
		);
	}

	return null;
}

/*
async function updateUserStatistics(
	userId: string,
	requestData: SendMessageRequest,
	result: any
) {
	const TIME_SAVED_PER_MESSAGE_HOURS = 0.0083; // 30 segundos en horas

	try {
		// Calcular métricas
		const messagesSent = result.summary?.successful || 0;
		const timeSavedHours = messagesSent * TIME_SAVED_PER_MESSAGE_HOURS;
		const newContacts = requestData.recipients.length;

		// Obtener estadísticas actuales
		const currentStats = await getUserStats.execute({ userId });

		if (currentStats && currentStats.length > 0) {
			const stats = currentStats[0].User_stats;
			await updateUserStats(
				userId,
				(stats.totalMessagesSent ?? 0) + messagesSent,
				(stats.totalTimeSavedHours ?? 0) + timeSavedHours,
				(stats.totalContacts ?? 0) + newContacts,
				new Date() // lastUpdated
			).execute();
		} else {
			await createUserStats.execute({
				id: uuid.uuid,
				userId: userId,
				totalMessagesSent: messagesSent,
				totalTimeSavedHours: timeSavedHours,
				totalContacts: newContacts,
				totalOrders: 0,
				lastMessageAt: new Date(),
			});
		}

		// Incrementar contador de template si se usó uno
		if (requestData.messageType === "template" && requestData.templateId) {
			await incrementTemplateCount.execute({ id: requestData.templateId });
		}
	} catch (error) {
		console.error("Error actualizando estadísticas:", error);
		// No fallar la solicitud completa por error en estadísticas
	}
}
*/
