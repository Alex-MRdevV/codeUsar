import { AppHeader } from "@/components/sidebar/appHeader"
import { NavUser } from "@/components/sidebar/nav-user"
import { NavMain } from "@/components/sidebar/navMain"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem
} from "@/components/ui/sidebar"
import { sidebarDataItems } from "@/utils/types/sidebar"
const data = sidebarDataItems

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<AppHeader />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.items} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	)
}
