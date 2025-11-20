import type { ErrorResponse, SuccessResponse } from "@/utils/types/file";

export const UploadFileResponse = async (
	files: File[]
): Promise<[Error, null] | [null, SuccessResponse]> => {
	try {
		const formData = new FormData();
		files.forEach((f) => formData.append("files", f));

		const response = await fetch(`api/files/uploads`, {
			method: "POST",
			body: formData,
			credentials: "include",
		});

		if (!response.ok) {
			const errorData: ErrorResponse = await response.json();
			return [new Error(errorData.message), null];
		}

		const data: SuccessResponse = await response.json();
		return [null, data];
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Error desconocido";
		return [new Error(errorMessage), null];
	}
};
