import { SidebarHeader, SidebarMenu } from "@/components/ui/sidebar";
import { siteName } from "@/utils/seoConfig";
import { Map } from "lucide-react";

export const Header = () => {
	return (
		<article>
			<SidebarHeader>
				<SidebarMenu>
					<section className="flex gap-2 justify-center">
						<div className="flex-col items-center justify-between">
							<Map className="rounded-lg bg-emerald-400 aspect-square size-8 text-white shadow-lg hover:bg-emerald-500 hover:shadow-xl transition-all duration-300" />
						</div>
						<span className="truncate text-lg font-bold">{siteName}</span>
					</section>
				</SidebarMenu>
			</SidebarHeader>
		</article>
	);
};
