import type { clientesEnRuta } from "@/utils/types/send";

export const allDataRuta = async (): Promise<clientesEnRuta[]> => {
	try {
		const response = await fetch("/api/data/allDataRuta", {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Error ${response.status}: ${response.statusText}`);
		}

		const result = await response.json();
		return result.data;
	} catch (error) {
		throw error;
	}
};
