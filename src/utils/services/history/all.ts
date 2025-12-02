import type {
	HistoryStatsParams,
	HistoryStatsResponse,
} from "@/utils/types/historyGeneral";

export const GetHistoryStats = async (
	params?: HistoryStatsParams
): Promise<[Error, null] | [null, HistoryStatsResponse]> => {
	try {
		// Construir query params
		const queryParams = new URLSearchParams();
		if (params?.startDate) queryParams.append("startDate", params.startDate);
		if (params?.endDate) queryParams.append("endDate", params.endDate);
		if (params?.templateId) queryParams.append("templateId", params.templateId);
		if (params?.limit) queryParams.append("limit", params.limit.toString());

		const url = `/api/history/stats${
			queryParams.toString() ? `?${queryParams.toString()}` : ""
		}`;

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

		const data: HistoryStatsResponse = await response.json();
		return [null, data];
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Error desconocido";
		return [new Error(errorMessage), null];
	}
};

// ========== FUNCIONES AUXILIARES ==========

/**
 * Obtiene estadísticas de los últimos N días
 */
export const getLastDaysStats = async (
	days: number = 30
): Promise<[Error, null] | [null, HistoryStatsResponse]> => {
	const endDate = new Date();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);

	return GetHistoryStats({
		startDate: startDate.toISOString().split("T")[0],
		endDate: endDate.toISOString().split("T")[0],
	});
};

/**
 * Obtiene estadísticas de una plantilla específica
 */
export const getTemplateHistory = async (
	templateId: string,
	limit?: number
): Promise<[Error, null] | [null, HistoryStatsResponse]> => {
	return GetHistoryStats({
		templateId,
		limit,
	});
};

/**
 * Obtiene estadísticas del mes actual
 */
export const getCurrentMonthStats = async (): Promise<
	[Error, null] | [null, HistoryStatsResponse]
> => {
	const now = new Date();
	const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
	const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

	return GetHistoryStats({
		startDate: startDate.toISOString().split("T")[0],
		endDate: endDate.toISOString().split("T")[0],
	});
};
