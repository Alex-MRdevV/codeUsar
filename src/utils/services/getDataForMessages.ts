import { HOSTINGER_URL_BASE } from "@/lib/utils";
import type { dataUsarMessages } from "@/utils/types/messages";

export const HostingerRequestGetDataSendMessage = async (): Promise<
	[Error, null] | [null, dataUsarMessages]
> => {
	try {
		const url = `${HOSTINGER_URL_BASE}/api/getData.php`;

		const response = await fetch(url, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			return [
				new Error(errorData.message || "Error al obtener estadísticas"),
				null,
			];
		}

		const data: dataUsarMessages = await response.json();
		return [null, data];
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Error desconocido";
		return [new Error(errorMessage), null];
	}
};
