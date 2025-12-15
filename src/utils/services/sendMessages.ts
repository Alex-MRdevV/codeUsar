import {
	buildTemplateMessage,
	buildTextMessage,
	buildTextReplyMessage,
} from "@/lib/providersMensajes/apiMeta/formatoMessages";
import type {
	MetaRequest,
	ReplyFreeTextMessageRequest,
	SendFreeTextMessageRequest,
	SendMessageRequest,
} from "@/utils/types/providers/meta";

export const buildMetaRequest = (
	recipient: string,
	request:
		| SendMessageRequest
		| SendFreeTextMessageRequest
		| ReplyFreeTextMessageRequest,
	customParams?: string[] | Record<string, string>
): MetaRequest => {
	// Caso 1: Mensaje de respuesta (con context)
	if ("replyToMessageId" in request) {
		const replyData = request as ReplyFreeTextMessageRequest;
		return buildTextReplyMessage(
			recipient,
			replyData.content,
			replyData.replyToMessageId
		);
	}

	// Caso 2: Mensaje de texto simple
	if (request.messageType === "text") {
		const textData = request as SendFreeTextMessageRequest;
		return buildTextMessage(recipient, textData.content);
	}

	// Caso 3: Mensaje de template
	if (request.messageType === "template") {
		const templateData = request as SendMessageRequest;
		return buildTemplateMessage(recipient, templateData, customParams);
	}

	throw new Error(
		`Tipo de mensaje no soportado: ${(request as any).messageType}`
	);
};
