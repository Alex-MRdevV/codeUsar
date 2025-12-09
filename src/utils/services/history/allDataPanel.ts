import type { DayStats } from "@/utils/types/historyGeneral";

export async function getDataForPanel(): Promise<
	[Error | null, DayStats[] | null]
> {
	try {
		const response = await fetch("/api/data/allDataPanel", {
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
		const data: DayStats[] = result.data;

		return [null, data];
	} catch (error) {
		return [error as Error, null];
	}
}
