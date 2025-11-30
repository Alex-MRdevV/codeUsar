import { Badge } from "@/components/ui/badge"
import { appConfig } from "@/utils/types/sidebar"

export const AppHeader = () => {
	const AppIcon = appConfig.Icon
	return (
		<article className="flex items-center gap-4 p-4">
			<section className="flex items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground aspect-square size-8">
				<AppIcon className="size-4" />
			</section>
			<section className="flex flex-col">
				<span className="text-lg font-medium">{appConfig.name}</span>
				<Badge variant="secondary" className="w-fit">
					Versión 1.0
				</Badge>
			</section>
		</article>
	)
}
