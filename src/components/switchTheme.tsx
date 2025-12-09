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
import { Moon, Sun } from "lucide-react";
import { useLayoutEffect } from "react";

export const SwitchTheme = () => {
	const theme = useStore(themeStore);

	useLayoutEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
		localStorage.setItem(THEME_STORAGE_KEY, theme);
	}, [theme]);

	const handleThemeChange = () => {
		themeStore.set(theme === "dark" ? "light" : "dark");
	};

	return (
		<TooltipProvider disableHoverableContent>
			<Tooltip delayDuration={100}>
				<TooltipTrigger asChild>
					<Button
						className="relative rounded-full w-10 h-10 bg-white/20 dark:bg-slate-700/50 backdrop-blur-sm border border-white/30 dark:border-slate-600/50 hover:bg-white/30 dark:hover:bg-slate-600/50 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden group"
						variant="ghost"
						size="icon"
						onClick={handleThemeChange}
					>
						{/* Efecto de brillo al hover */}
						<span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

						{/* Iconos con animación mejorada */}
						<Sun className="absolute w-5 h-5 transition-all duration-500 ease-in-out dark:rotate-90 dark:scale-0 dark:opacity-0 rotate-0 scale-100 opacity-100 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
						<Moon className="absolute w-5 h-5 transition-all duration-500 ease-in-out dark:rotate-0 dark:scale-100 dark:opacity-100 -rotate-90 scale-0 opacity-0 text-blue-300 drop-shadow-[0_0_8px_rgba(147,197,253,0.5)]" />

						<span className="sr-only">Cambiar tema</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent
					side="bottom"
					className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-sm border-slate-700/50 text-white"
				>
					Cambiar tema
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
