import { UserButton } from "@clerk/astro/react"

import {
	DropdownMenu,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from "@/components/ui/sidebar"
import { $userStore } from '@clerk/astro/client'

export function NavUser() {
	const user = $userStore.get()
	if (!user) return null

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<UserButton
								appearance={{
									elements: {
										rootBox: "w-full",
										avatarBox: "w-8 h-8"
									}
								}}
							/>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.fullName}</span>
							</div>
						</SidebarMenuButton>
					</DropdownMenuTrigger>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
