import type { ErrorResponse, SuccessResponse } from "@/utils/types/file";

export const GetStoredNumbers = async (): Promise<
	[Error, null] | [null, SuccessResponse]
> => {
	try {
		const response = await fetch(`api/meta/uploadNumbers`, {
			method: "GET",
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
			error instanceof Error
				? error.message
				: "Error desconocido al consultar números";
		return [new Error(errorMessage), null];
	}
};
