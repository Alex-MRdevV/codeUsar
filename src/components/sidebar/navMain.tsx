import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem
} from "@/components/ui/sidebar"
import type { PropsNavMain } from "@/utils/types/sidebar"

export function NavMain({ items }: PropsNavMain) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Opciones</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<SidebarMenuItem key={item.title}>
						<a
							href={item.url}
							className="flex items-center gap-2 rounded-md p-2 transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
						>
							{item.icon && <item.icon className="size-4" />}
							<span className="text-sm font-medium">{item.title}</span>
						</a>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	)
}
