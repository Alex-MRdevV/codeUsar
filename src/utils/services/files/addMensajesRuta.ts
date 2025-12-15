import type { dataUsar } from "@/utils/types/send";

export const UploadPhonesRequestRutas = async (
	file: File,
	status: "pedidosEnRUTADOS"
): Promise<[Error, null] | [null, dataUsar[]]> => {
	try {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("status", status);

		const response = await fetch(`/api/files/uploadRuta`, {
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
