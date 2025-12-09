import type { HeatmapDataPoint } from "@/utils/types/historyGeneral";

export async function getDataForDays(): Promise<
	[Error | null, HeatmapDataPoint[] | null]
> {
	try {
		const response = await fetch("/api/data/allDataDays", {
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
		const data: HeatmapDataPoint[] = result.data;

		return [null, data];
	} catch (error) {
		return [error as Error, null];
	}
}
