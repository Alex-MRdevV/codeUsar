import { useEffect, useState } from "react";

export function useMessage<T = null>(initialState: T = null as T) {
	const [message, setMessage] = useState<T>(initialState);

	useEffect(() => {
		if (message) {
			const timer = setTimeout(() => {
				setMessage(null as T);
			}, 3000); // tiempo que se muestra el mensaje

			return () => clearTimeout(timer);
		}
	}, [message]);
	const updateMessage = (newMessage: T) => setMessage(newMessage);

	return { message, setMessage, updateMessage };
}
