import Logo from "@/assets/logo.png";
import { SwitchTheme } from "@/components/switchTheme";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const Header = () => {
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16 bg-sky-700">
			<nav className=" border-gray-200 lg:px-6 py-2.5 dark:bg-gray-800">
				<div className="flex justify-between items-center max-w-2xl">
					<span className="flex items-center">
						<SidebarTrigger id="sidebar-trigger" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<a href="/"><img src={Logo.src} className="mr-3 h-6 sm:h-9" alt="LOGISTICOS" /></a>
					</span>
				</div>
				<section className="absolute right-4 top-4">
					<SwitchTheme />
				</section>
			</nav>
		</header>
	);
};
