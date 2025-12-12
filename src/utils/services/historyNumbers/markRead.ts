export const markReadNotification = async (id: string) => {
	try {
		const response = await fetch("/api/historyNumbers/notificationsMarkRead", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({ id }),
		});

		if (!response.ok) {
			const errorText = await response.text().catch(() => "");
			return [
				new Error("Error en la respuesta del servidor: " + errorText),
				null,
			] as const;
		}

		const data = await response.json().catch(() => null);
		return [null, data] as const;
	} catch (error) {
		return [error as Error, null] as const;
	}
};
