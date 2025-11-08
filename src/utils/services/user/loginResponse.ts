import type { responseMessage, userDataLogin } from "@/utils/types/user";

export const loginResponse = async (
	user: userDataLogin,
): Promise<[Error | null, responseMessage | null]> => {
	try {
		const response = await fetch("/api/user/", {
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
		return [null, data.userAccess];
	} catch (error) {
		return [error as Error, null];
	}
};
