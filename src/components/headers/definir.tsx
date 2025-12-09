import { $userStore } from "@clerk/astro/client";
import { HeaderAuthenticated } from "./autenticado";
import { HeaderUnauthenticated } from "./noAutenticado";

export const HeaderApp = () => {
	const user = $userStore.get();

	return user ? (
		<HeaderAuthenticated />
	) : (
		<HeaderUnauthenticated />
	);
};
