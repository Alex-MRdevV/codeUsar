import type {
	DayHistoryResponse,
	DayMessageHistory,
} from "@/utils/types/historyGeneral";

export const CreateAndUpdateDayInHistory = async (
	dayData: DayMessageHistory
): Promise<[Error, null] | [null, DayHistoryResponse]> => {
	try {
		const endpoint = `/api/history/add`;

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
