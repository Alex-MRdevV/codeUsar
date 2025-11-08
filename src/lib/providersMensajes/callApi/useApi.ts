import type { ApiResponse } from "@/utils/types/providers/meta";
import type { SendMessageRequest } from "@/utils/types/providers/meta";

export async function sendWhatsAppMessage(
	messageData: SendMessageRequest
): Promise<[Error | null, ApiResponse | null]> {
	try {
		const response = await fetch("/api/meta", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(messageData),
		});

		const data: ApiResponse = await response.json();

		if (!response.ok) {
			return [new Error(data.message || "Error al enviar mensaje"), null];
		}

		return [null, data];
	} catch (error) {
		return [error as Error, null];
	}
}
