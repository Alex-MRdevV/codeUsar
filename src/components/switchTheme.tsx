import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@/components/ui/tooltip";
import { themeStore } from "@/stores/themes";
import { THEME_STORAGE_KEY } from "@/utils/types/const";
import { useStore } from "@nanostores/react";
import { Moon, SunMoon } from "lucide-react";
import { useEffect } from "react";

export const SwitchTheme = () => {
	const theme = useStore(themeStore);

	// Sincronizar el tema con el DOM y localStorage
	useEffect(() => {
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}

		localStorage.setItem(THEME_STORAGE_KEY, theme); // Guardar la preferencia actual
	}, [theme]);

	const handleThemeChange = () => {
		themeStore.set(theme === "dark" ? "light" : "dark");
	};

	return (
		<TooltipProvider disableHoverableContent>
			<Tooltip delayDuration={100}>
				<TooltipTrigger asChild>
					<Button
						className="rounded-full w-8 h-8 bg-background mr-2 flex items-center justify-center"
						variant="outline"
						size="icon"
						onClick={handleThemeChange}
					>
						<SunMoon className="absolute w-5 h-5 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100 rotate-90 scale-0 text-yellow-500" />
						<Moon className="absolute w-5 h-5 transition-transform ease-in-out duration-500 dark:-rotate-90 dark:scale-0 rotate-0 scale-100 text-violet-870" />
						<span className="sr-only">Cambiar tema</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent side="bottom">Cambiar tema</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
