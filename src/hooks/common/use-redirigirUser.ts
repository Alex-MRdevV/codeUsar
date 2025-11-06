import { useEffect, useState } from "react";

export function useRedirigir<T = null>(initialState: T = null as T) {
	const [user, setUser] = useState<T>(initialState);

	useEffect(() => {
		const redirigirUser = () => {
			if (user) {
				// Dispara el evento solo si hay datos de usuario
				window.dispatchEvent(
					new CustomEvent("userAuthenticate", { detail: user })
				);
			}
		};

		redirigirUser();
	}, [user]);

	return { user, setUser };
}
