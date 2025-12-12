import type { NotificationUsar } from "@/utils/types/chats";

export const getRecentNotifications = async (): Promise<
	[Error | null, NotificationUsar[] | null]
> => {
	try {
		const response = await fetch("/api/historyNumbers/allNotifications", {
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
