import type { dataUsarMessages } from "@/utils/types/messages";

export const allDataTransitoria = async (): Promise<dataUsarMessages> => {
	try {
		const response = await fetch("/api/data/allData", {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Error ${response.status}: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
};
