import Logo from "@/assets/logo.webp";
import { SwitchTheme } from "@/components/switchTheme";

export const Header = () => {
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 transition-all ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16 fixed z-20 w-full backdrop-blur-md bg-sky-600/80 dark:bg-slate-900/80 border-b border-sky-700/50 dark:border-slate-700/50 shadow-sm">
			<nav className="w-full px-4 lg:px-6 py-2.5">
				<div className="flex justify-between items-center max-w-full">
					<span className="flex items-center gap-2">
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
