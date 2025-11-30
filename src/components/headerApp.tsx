import Logo from "@/assets/logo.webp";
import { SwitchTheme } from "@/components/switchTheme";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { $userStore } from '@clerk/astro/client';
import { SignInButton } from '@clerk/astro/react';

export const Header = () => {
	const user = $userStore.get()
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 transition-all ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16 fixed z-20 w-full backdrop-blur-md bg-sky-600/80 dark:bg-slate-900/80 border-b border-sky-700/50 dark:border-slate-700/50 shadow-sm">
			<nav className="w-full px-4 lg:px-6 py-2.5">
				<div className="flex justify-between items-center max-w-full">
					<span className="flex items-center gap-2">
						{user && (
							<>
								<SidebarTrigger
									id="sidebar-trigger"
									className="text-white dark:text-slate-200 hover:bg-white/10 dark:hover:bg-slate-700/50"
								/>
								<Separator
									orientation="vertical"
									className="h-6 bg-white/30 dark:bg-slate-600/50"
								/>
							</>
						)}
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

					<div className="flex items-center gap-3 md:gap-4">
						<div className="hidden md:flex items-center gap-1">
							{!user ? (
								<SignInButton mode="modal">
									<span className="px-3 py-2 text-sm font-medium text-white dark:text-slate-200 hover:bg-white/10 dark:hover:bg-slate-700/50 rounded-md transition-colors">
										Iniciar sesión
									</span>
								</SignInButton>
							) : (
								<a
									href={`/users/index`}
									className="px-3 py-2 text-sm font-medium text-white dark:text-slate-200 hover:bg-white/10 dark:hover:bg-slate-700/50 rounded-md transition-colors"
								>
									Ir a tu panel
								</a>
							)}
						</div>

						{/* Separador visual */}
						<div className="hidden md:block">
							<Separator
								orientation="vertical"
								className="h-6 bg-white/30 dark:bg-slate-600/50"
							/>
						</div>
						<SwitchTheme />
					</div>
				</div>
			</nav>
		</header>
	);
};
