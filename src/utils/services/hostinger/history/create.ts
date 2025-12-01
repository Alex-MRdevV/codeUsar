import { HOSTINGER_URL_BASE } from "@/lib/utils";
import type {
	DayHistoryResponse,
	DayMessageHistory,
} from "@/utils/types/historyGeneral";

export const HostingerRequestCreateOrUpdateDayInHistory = async (
	dayData: DayMessageHistory
): Promise<[Error, null] | [null, DayHistoryResponse]> => {
	try {
		// Determinar si es creación o actualización basado en la presencia de id
		const isUpdate = !!dayData.id;
		const endpoint = isUpdate
			? `${HOSTINGER_URL_BASE}/api/history/update.php`
			: `${HOSTINGER_URL_BASE}/api/history/add.php`;

		const response = await fetch(endpoint, {
			method: "POST",
			body: JSON.stringify(dayData),
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			return [new Error(errorData.message || "Error en la petición"), null];
		}

		const data: DayHistoryResponse = await response.json();
		return [null, data];
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Error desconocido";
		return [new Error(errorMessage), null];
	}
};
