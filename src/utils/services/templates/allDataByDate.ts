import type { DayData } from "@/utils/types/historyGeneral";

export async function getDataForDays(): Promise<
	[Error | null, DayData[] | null]
> {
	try {
		const response = await fetch("/api/data/allDataDays", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		const data: DayData[] = await response.json();

		if (!response.ok) {
			return [new Error(), null];
		}
		return [null, data];
	} catch (error) {
		return [error as Error, null];
	}
}
