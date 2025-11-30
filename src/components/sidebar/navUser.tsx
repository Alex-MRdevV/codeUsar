import {
	SidebarMenu,
	SidebarMenuItem
} from "@/components/ui/sidebar"
import { UserButton } from "@clerk/astro/react"

export function NavUser() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<UserButton
					appearance={{
						elements: {
							rootBox: "w-full",
							avatarBox: "w-8 h-8"
						}
					}}
				/>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
