import type { ResultadoAgrupado } from "@/utils/types/bavariaNowData";

export const UploadBavariaNowRequest = async (
	file: File
): Promise<[Error, null] | [null, ResultadoAgrupado]> => {
	try {
		const formData = new FormData();
		formData.append("file", file);

		const response = await fetch(`/api/files/uploadBavariaNow`, {
			method: "POST",
			body: formData,
			credentials: "include",
		});

		if (!response.ok) {
			const errorData = await response.json();
			return [new Error(errorData.message), null];
		}

		const data: ResultadoAgrupado = await response.json();
		return [null, data];
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Error desconocido";
		return [new Error(errorMessage), null];
	}
};
