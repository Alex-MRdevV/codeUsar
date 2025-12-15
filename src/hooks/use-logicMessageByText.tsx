import type { ReplyFreeTextMessageRequest, SendFreeTextMessageRequest } from "@/utils/types/providers/meta";
import type { UseFreeTextMessagesProps } from "@/utils/types/send";
import { useMemo } from "react";

export const useMessagesLogicText = (
	props: UseFreeTextMessagesProps | null
) => {
	// 🛑 estado neutro
	if (!props) {
		return {
			validRecipients: [] as string[],
			buildPayload: () => {
				throw new Error("useMessagesLogicText: props is null");
			},
			canSend: () => false,
			getRecipientCount: () => 0,
		};
	}

	const {
		recipients = [],
		content,
		previewUrl = false,
		replyToMessageId,
	} = props;

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

	const safeContent = typeof content === "string" ? content : "";
	const canSend = (): boolean =>
		safeContent.trim().length > 0 &&
		validRecipients.length > 0;

	const getRecipientCount = () => validRecipients.length;

	return {
		validRecipients,
		buildPayload,
		canSend,
		getRecipientCount,
	};
};
