import type { dataUsar } from "@/utils/types/messages";

export const UploadPhonesRequestBavariaNow = async (
	file: File,
	status: "confirmar_pedido"
): Promise<[Error, null] | [null, dataUsar[]]> => {
	try {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("status", status);

		const response = await fetch(`/api/files/uploadBavariaNow`, {
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
