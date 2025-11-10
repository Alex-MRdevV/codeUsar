import type { responseMessage, userDevolver } from "@/utils/types/user";

export const updateResponse = async (
	user: userDevolver
): Promise<[Error | null, responseMessage | null]> => {
	try {
		const response = await fetch(`/api/user/update`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
		});

		if (!response.ok) {
			// capturar el error que devuelve el backend
			const errorData = await response.json();
			return [new Error(errorData.message), null];
		}

		const data = await response.json();
		return [null, data];
	} catch (error) {
		return [error as Error, null];
	}
};
