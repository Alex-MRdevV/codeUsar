import type { ErrorResponse, SuccessResponse } from "@/utils/types/file";

export const UploadFileResponse = async (): Promise<
	[Error, null] | [null, SuccessResponse]
> => {
	try {
		const response = await fetch(`api/meta/uploadNumbers`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
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
