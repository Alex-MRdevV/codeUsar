import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/use-logout";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export const LogoutButton = () => {
	const { logout } = useLogout();

	const handleLogout = () => {
		toast.promise(logout(), {
			loading: 'Cerrando sesión...',
			success: 'Has cerrado la sesión',
			error: 'No se pudo cerrar la sesión',
		});
	};

	return (
		<DropdownMenuItem onClick={handleLogout}>
			<LogOut />
			Cerrar sesión
		</DropdownMenuItem>
	)
}
