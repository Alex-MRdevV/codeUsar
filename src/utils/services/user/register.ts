import type { FormValuesCreate } from "@/lib/schemas/user/register";
import type { userData, userDevolver } from "@/utils/types/user";

export const registerResponse = async (
	user: FormValuesCreate
): Promise<[Error | null, userDevolver | null]> => {
	try {
		const response = await fetch(`/api/user/register`, {
			method: "POST",
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
