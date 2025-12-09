import type { LoginInput } from "@/lib/schemas/user/login";
import type { UserDevolver } from "@/utils/types/user";

export const loginResponse = async (
	user: LoginInput
): Promise<[Error | null, UserDevolver | null]> => {
	try {
		const response = await fetch("/api/user/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
			credentials: "include",
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
