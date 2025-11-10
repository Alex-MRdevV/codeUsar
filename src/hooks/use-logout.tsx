import { logoutResponse } from "@/utils/services/user/logout";
import { useState } from "react";

export const useLogout = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const logout = async () => {
		setIsLoading(true);
		setError(null);

		const [err, message] = await logoutResponse();

		if (err) {
			setError(err);
			setIsLoading(false);
			throw err;
		}

		if (message) {
			// Recargar la página después de un logout exitoso
			window.location.reload();
		}

		setIsLoading(false);
	};

	return { logout, isLoading, error };
};
