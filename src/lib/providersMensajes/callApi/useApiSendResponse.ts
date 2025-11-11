import type {
	ReplyApiResponse,
	ReplyMessageRequest,
} from "@/utils/types/providers/meta";

export async function sendWhatsAppMessage(
	messageData: ReplyMessageRequest
): Promise<[Error | null, ReplyApiResponse | null]> {
	try {
		const response = await fetch("/api/meta/messagesReply", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(messageData),
		});

		const data: ReplyApiResponse = await response.json();

		if (!response.ok) {
			return [new Error(data.message || "Error al enviar mensaje"), null];
		}

		return [null, data];
	} catch (error) {
		return [error as Error, null];
	}
}
