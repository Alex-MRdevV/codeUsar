import type { ResultadoAgrupado } from "@/utils/types/bavariaNowData";

export const addDataBavariaNow = async (fullData: ResultadoAgrupado) => {
	try {
		const response = await fetch("/api/data/addDataBavaria", {
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
