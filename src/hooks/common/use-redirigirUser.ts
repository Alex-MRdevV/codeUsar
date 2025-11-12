import { useEffect, useState } from "react";

export function useRedirigir<T = null>(
	initialState: T = null as T,
	event: string
) {
	const [user, setUser] = useState<T>(initialState);

	useEffect(() => {
		const redirigirUser = () => {
			if (user) {
				window.dispatchEvent(new CustomEvent(event, { detail: user }));
			}
		};

		redirigirUser();
	}, [user, event]);

	return { user, setUser };
}
