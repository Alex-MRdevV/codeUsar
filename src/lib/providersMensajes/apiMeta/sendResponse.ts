import { urlEnviarMensajeTexto } from "@/lib/providersMensajes/metaUrls";
import { buildMetaReplyRequest } from "@/utils/services/sendMessageSpecific";
import type {
	MessageResult,
	ReplyMessageRequest,
} from "@/utils/types/providers/meta";

export const enviarRespuestaIndividual = async (
	recipient: string,
	datos: ReplyMessageRequest,
	accessToken: string,
	phoneNumberId: string
): Promise<MessageResult> => {
	try {
		const metaRequest = buildMetaReplyRequest(recipient, datos);
		const url = urlEnviarMensajeTexto(phoneNumberId);

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(metaRequest),
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				recipient,
				status: "error",
				errorCode: data.error?.code,
				errorMessage: data.error?.message || "Error desconocido",
			};
		}

		return {
			recipient,
			messageId: data.messages?.[0]?.id,
			status: "success",
		};
	} catch (error) {
		return {
			recipient,
			status: "error",
			errorMessage: (error as Error).message,
		};
	}
};
