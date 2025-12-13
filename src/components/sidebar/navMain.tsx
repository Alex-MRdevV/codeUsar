import { Collapsible } from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from "@/components/ui/sidebar";
import type { PropsNavMain } from "@/utils/types/sidebar";

export const NavMain = ({ items }: PropsNavMain) => {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Opciones</SidebarGroupLabel>

			<SidebarMenu>
				{items.map((item) => (
					<Collapsible
						key={item.title}
						asChild
						className="group/collapsible"
					>
						<SidebarMenuItem>
							<SidebarMenuButton tooltip={item.title}>
								{item.icon && (
									<item.icon
										className={item.color ?? "text-muted-foreground"}
									/>
								)}

								<a href={item.url} className="flex items-center gap-2">
									<span>{item.title}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
