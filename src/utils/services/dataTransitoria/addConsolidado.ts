import type { ResultadoAgrupado } from "@/utils/types/consolidadoData";

export const addDataConsolidado = async (fullData: ResultadoAgrupado) => {
	try {
		const response = await fetch("/api/data/addDataConsolidado", {
			method: "POST",
			body: JSON.stringify(fullData),
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
