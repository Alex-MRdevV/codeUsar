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

		// ✅ CORRECCIÓN: El endpoint devuelve { message, data }
		const result = await response.json();

		// ✅ Extraer el array del campo 'data'
		const dataArray = result.data || [];

		// ✅ Validar que sea un array
		if (!Array.isArray(dataArray)) {
			console.error("La respuesta no contiene un array válido:", result);
			return [];
		}

		// ✅ Mapear los datos al formato esperado (dataUsar)
		return dataArray.map((item: any) => ({
			name: item.nombre || "",
			phone: item.phoneNumber || "",
			typeMessage:
				(item.mensaje as dataUsar["typeMessage"]) || "confirmar_pedido",
		}));
	} catch (error) {
		console.error("Error en allDataClientesMensajes:", error);
		// ✅ Retornar array vacío en caso de error
		return [];
	}
};
