import { AppHeader } from "@/components/sidebar/appHeader"
import { NavMain } from "@/components/sidebar/navMain"
import { NavUser } from "@/components/sidebar/navUser"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar"
import type { dataUserSidebar } from "@/utils/types/sidebar"

export function AppSidebar({ items, user }: dataUserSidebar) {
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<AppHeader />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={items.items} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser email={user.email} name={user.name} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
