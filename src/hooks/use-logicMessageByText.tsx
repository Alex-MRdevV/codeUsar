import type { ReplyFreeTextMessageRequest, SendFreeTextMessageRequest } from "@/utils/types/providers/meta";
import type { UseFreeTextMessagesProps } from "@/utils/types/send";
import { useMemo } from "react";

export const useMessagesLogicText = ({
	recipients = [],
	content,
	previewUrl = false,
	replyToMessageId,
}: UseFreeTextMessagesProps) => {

	// Validar números
	const validRecipients = useMemo(() => {
		return recipients.filter(phone => {
			const cleaned = phone.replace(/\s/g, '');
			return /^\+?\d{10,15}$/.test(cleaned);
		});
	}, [recipients]);

	// Construir payload según si es respuesta o mensaje nuevo
	const buildPayload = (): SendFreeTextMessageRequest | ReplyFreeTextMessageRequest => {
		const truncatedContent = content.slice(0, 4096);

		// Si hay replyToMessageId, es una respuesta
		if (replyToMessageId) {
			return {
				messageType: "text",
				recipient: validRecipients[0] || "", // Solo un destinatario en respuestas
				replyToMessageId,
				content: truncatedContent,
				previewUrl,
			};
		}

		// Si no, es un mensaje nuevo (múltiples destinatarios)
		return {
			messageType: "text",
			recipients: validRecipients,
			content: truncatedContent,
			previewUrl,
		};
	};

	const canSend = (): boolean => {
		if (!content.trim()) return false;
		return validRecipients.length > 0;
	};

	const getRecipientCount = () => validRecipients.length;

	const messageStats = useMemo(() => {
		const hasUrls = /(https?:\/\/[^\s]+)/g.test(content);

		return {
			length: content.length,
			maxLength: 4096,
			remaining: 4096 - content.length,
			hasEmojis: /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(content),
			hasUrls,
			isValid: content.length > 0 && content.length <= 4096,
		};
	}, [content]);

	return {
		validRecipients,
		buildPayload,
		canSend,
		getRecipientCount,
		messageStats,
	};
};
