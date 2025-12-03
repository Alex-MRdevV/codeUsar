import type { dataUsar } from "@/utils/types/messages";

export const UploadPhonesRequest = async (
	file: File,
	status:
		| "pedidos_no_planeados"
		| "pedidos_retrasados"
		| "confirmar_pedido"
		| "confirmacion_de_pedido"
): Promise<[Error, null] | [null, dataUsar[]]> => {
	try {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("status", status); // Agregar el status aquí

		const response = await fetch(`/api/files/upload`, {
			method: "POST",
			body: formData,
			credentials: "include",
		});

		if (!response.ok) {
			const errorData = await response.json();
			return [new Error(errorData.message), null];
		}

		const data: dataUsar[] = await response.json();
		return [null, data];
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Error desconocido";
		return [new Error(errorMessage), null];
	}
};
