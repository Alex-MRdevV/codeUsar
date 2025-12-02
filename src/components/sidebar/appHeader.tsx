import { Badge } from "@/components/ui/badge";
import { appConfig } from "@/utils/types/sidebar";

export const AppHeader = () => {
	const AppIcon = appConfig.Icon
	return (
		<article className="flex items-center gap-4 p-4">
			<section className="flex gap-3 items-center justify-between">
				<div className="flex gap-2 items-center">
					<AppIcon className="size-4" />
					<span className="text-lg font-medium">{appConfig.name}</span>
					<Badge variant="secondary" className="w-fit">
						Versión 1.0
					</Badge>
				</div>
			</section>
		</article>
	)
}
