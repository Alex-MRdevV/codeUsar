import { res } from "@/utils/responseAstro";
import type {
	ReplyFreeTextMessageRequest,
	SendFreeTextMessageRequest,
	SendMessageRequest,
} from "@/utils/types/providers/meta";
import type { MessageData, ValidationError } from "@/utils/types/send";

export const validateSendMessageRequest = (
	data: MessageData,
	type: "template" | "text"
): ValidationError | null => {
	// Validar que messageType coincida con el type enviado
	if (data.messageType !== type) {
		return {
			message: `El messageType '${data.messageType}' no coincide con el type '${type}' especificado`,
			status: 400,
		};
	}

	// Validaciones para mensajes de tipo TEMPLATE
	if (type === "template") {
		const templateData = data as SendMessageRequest;

		// Validar destinatarios
		if (!templateData.recipients?.length) {
			return {
				message: "No hay destinatarios en la solicitud",
				status: 400,
			};
		}

		// Validar campos requeridos para templates
		if (!templateData.templateName || !templateData.templateLanguage) {
			return {
				message:
					"templateName y templateLanguage son requeridos para messageType: 'template'",
				status: 400,
			};
		}

		// Validar templateId
		if (!templateData.templateId) {
			return {
				message: "templateId es requerido para messageType: 'template'",
				status: 400,
			};
		}

		// Validar parameterFormat si se usan templateParams
		if (templateData.templateParams && !templateData.parameterFormat) {
			return {
				message: "parameterFormat es requerido cuando se usan templateParams",
				status: 400,
			};
		}
	}

	// Validaciones para mensajes de tipo TEXT
	if (type === "text") {
		// Validar content en todos los casos
		if (!data.content || data.content.trim() === "") {
			return {
				message:
					"content es requerido y no puede estar vacío para messageType: 'text'",
				status: 400,
			};
		}

		// Validar longitud máxima del contenido
		if (data.content.length > 4096) {
			return {
				message: "content no puede exceder los 4096 caracteres",
				status: 400,
			};
		}

		// Determinar si es un mensaje de respuesta o envío masivo/individual
		if ("replyToMessageId" in data) {
			// Es un ReplyFreeTextMessageRequest
			const replyData = data as ReplyFreeTextMessageRequest;

			if (!replyData.recipient || replyData.recipient.trim() === "") {
				return {
					message: "recipient es requerido para respuestas",
					status: 400,
				};
			}

			if (
				!replyData.replyToMessageId ||
				replyData.replyToMessageId.trim() === ""
			) {
				return {
					message: "replyToMessageId es requerido para respuestas",
					status: 400,
				};
			}
		} else {
			// Es un SendFreeTextMessageRequest
			const textData = data as SendFreeTextMessageRequest;

			if (!textData.recipients?.length) {
				return {
					message:
						"recipients es requerido y debe contener al menos un destinatario",
					status: 400,
				};
			}

			// Validar formato de números de teléfono
			const invalidRecipients = textData.recipients.filter(
				(phone) => !phone || typeof phone !== "string" || phone.trim() === ""
			);

			if (invalidRecipients.length > 0) {
				return {
					message:
						"Todos los destinatarios deben ser números de teléfono válidos",
					status: 400,
				};
			}
		}
	}

	return null;
};

export const validateAndRespond = (
	data: MessageData,
	type: "template" | "text",
	res: (body: any, options: { status: number }) => any
) => {
	const error = validateSendMessageRequest(data, type);
	if (error) {
		return res({ message: error.message }, { status: error.status });
	}
	return null;
};
