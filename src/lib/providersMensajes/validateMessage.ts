import { res } from "@/utils/responseAstro";
import type { SendMessageRequest } from "@/utils/types/providers/meta";

export const validateSendMessageRequest = (data: SendMessageRequest) => {
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
};
