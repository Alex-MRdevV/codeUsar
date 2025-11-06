import { Button } from "@/components/ui/button";
import { logoutResponse } from "@/lib/auth/authUsersApi";
import { Toaster, toast } from "sonner";
import { ImExit } from "react-icons/im";
import { ResponseMessage } from "@/lib/types";
import { useEffect, useState } from "react";

export const LogoutButton = () => {
	const [message, setMessage] = useState<Error | ResponseMessage>();
	const [user, setUser] = useState<ResponseMessage>();

	useEffect(() => {
		const redirigirUser = () => {
			if (user) {
				// Solo dispara el evento si no hay error y se realizo el cambio
				window.location.reload();
			}
		};

		redirigirUser();
	}, [user]);

	const handleClick = async () => {
		const [err, message] = await logoutResponse();

		if (err) {
			setMessage(err);
		} else if (message) {
			setMessage(message);
			setUser(message);
		}
	};

	return (
		<div className="relative">
			<Button
				onClick={() => {
					toast.promise(handleClick, {
						success: "has cerrado la sesión",
						loading: "cerrando sesión ...",
						error: "no se pudo cerrar la sesión",
					});
				}}
				type="button"
				className="items-center"
			>
				<ImExit />
				Cerrar sesión
			</Button>

			<Toaster theme="system" richColors position="bottom-right" />
		</div>
	);
};
