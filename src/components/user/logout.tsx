/*
import { Button } from "@/components/ui/button";
import { useMessage } from "@/hooks/common/use-sendMessage";
import { logoutResponse } from "@/lib/auth/authUsersApi";
import type { responseMessage } from "@/utils/types/user";
import { ImExit } from "react-icons/im";
import { Toaster, toast } from "sonner";
import { useRedirigir } from "@/hooks/common/use-redirigirUser";

export const LogoutButton = () => {
	const { message,setMessage } = useMessage(null);
	const { setUser } = useRedirigir<responseMessage>();

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
						error: message,
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
*/
