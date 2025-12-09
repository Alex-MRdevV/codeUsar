import { HeaderAuthenticated } from "@/components/headers/autenticado";
import { HeaderUnauthenticated } from "@/components/headers/noAutenticado";
import { userContext } from "@/stores/user";
import { useStore } from "@nanostores/react";

export const HeaderApp = () => {
	const user = useStore(userContext);

	return user?.isLoggedIn ? (
		<HeaderAuthenticated />
	) : (
		<HeaderUnauthenticated />
	);
};
