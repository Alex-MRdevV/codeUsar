import Logo from "@/assets/logo.webp";
import { SwitchTheme } from "@/components/switchTheme";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const Header = () => {
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 transition-all ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16 bg-linear-to-r from-sky-600 to-sky-700 dark:from-slate-900/95 dark:to-slate-800/95 dark:backdrop-blur-xl dark:border-b dark:border-slate-700/50 shadow-sm">
			<nav className="w-full px-4 lg:px-6 py-2.5">
				<div className="flex justify-between items-center max-w-full">
					<span className="flex items-center gap-2">
						<SidebarTrigger
							id="sidebar-trigger"
							className="text-white dark:text-slate-200 hover:bg-white/10 dark:hover:bg-slate-700/50"
						/>
						<Separator
							orientation="vertical"
							className="h-6 bg-white/30 dark:bg-slate-600/50"
						/>
						<a href="/" className="flex items-center transition-transform hover:scale-105">
							<img
								src={Logo.src}
								className="h-8 sm:h-10 drop-shadow-md"
								alt="LOGÍSTICOS"
							/>
						</a>
					</span>

					<SwitchTheme />
				</div>
			</nav>
		</header>
	);
};
