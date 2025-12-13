import type {
	ApiResponse,
	ReplyFreeTextMessageRequest,
	SendFreeTextMessageRequest,
	SendMessageRequest,
} from "@/utils/types/providers/meta";

export const sendWhatsAppMessage = async (
	messageData:
		| SendMessageRequest
		| SendFreeTextMessageRequest
		| ReplyFreeTextMessageRequest,
	alcance: "Masivo" | "individual",
	type: "template" | "text"
): Promise<[Error | null, ApiResponse | null]> => {
	try {
		const response = await fetch("/api/meta/messagesSend", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				messageData: messageData,
				alcance: alcance,
				type: type,
			}),
		});

		const data: ApiResponse = await response.json();
		if (!response.ok) {
			return [new Error(data.message || "Error al enviar mensaje"), null];
		}

		return [null, data];
	} catch (error) {
		return [error as Error, null];
	}
};
