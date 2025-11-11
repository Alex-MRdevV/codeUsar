import type { PhoneData } from "@/utils/types/message";

export async function getPhones(): Promise<PhoneData[]> {
	try {
		const response = await fetch(`$/api/phones`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			throw new Error(`Error al obtener teléfonos: ${response.statusText}`);
		}

		const data: PhoneData[] = await response.json();
		return data;
	} catch (error) {
		throw error;
	}
}
