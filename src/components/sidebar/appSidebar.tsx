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
import { $userStore } from '@clerk/astro/client'

export function AppSidebar({ items }: dataUserSidebar) {
	const user = $userStore.get()
	if (!user) return null
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<AppHeader />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={items.items} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
