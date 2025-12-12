import type { Conversation } from "@/utils/types/chats";

export const getAllConversationsChats = async (): Promise<
	[Error | null, Conversation[] | null]
> => {
	try {
		const response = await fetch("/api/historyNumbers/allConversations", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			return [new Error("Error en la respuesta del servidor"), null];
		}

		const result = await response.json();
		const data = result.data;
		return [null, data];
	} catch (error) {
		return [error as Error, null];
	}
};
