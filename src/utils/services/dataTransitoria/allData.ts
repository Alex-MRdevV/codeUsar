import type { dataUsar } from "@/utils/types/messages";

export const allDataClientesMensajes = async (): Promise<dataUsar[]> => {
	try {
		const response = await fetch("/api/data/allDataClientes", {
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
		const dataArray = result.data || [];

		if (!Array.isArray(dataArray)) return [];

		//Mapear los datos al formato esperado (dataUsar)
		return dataArray.map((item: any) => ({
			name: item.nombre || "",
			phone: item.phoneNumber || "",
			typeMessage:
				(item.mensaje as dataUsar["typeMessage"]) || "confirmar_pedido",
		}));
	} catch (error) {
		return [];
	}
};
