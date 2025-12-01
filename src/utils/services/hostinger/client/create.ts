import { HOSTINGER_URL_BASE } from "@/lib/utils";
import type { DataByStatusRuta } from "@/utils/types/consolidadoData";

export const HostingerRequestCreateClients = async (
	dataUsar: DataByStatusRuta
): Promise<[Error, null] | [null, DataByStatusRuta]> => {
	try {
		const response = await fetch(`${HOSTINGER_URL_BASE}/api/client/add.php`, {
			method: "POST",
			body: JSON.stringify(dataUsar),
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			return [new Error(errorData.message), null];
		}

		const data: DataByStatusRuta = await response.json();
		return [null, data];
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Error desconocido";
		return [new Error(errorMessage), null];
	}
};
