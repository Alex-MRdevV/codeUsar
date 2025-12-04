import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { HeatmapTooltipSectionProps } from "@/utils/types/history";

export const TooltipSection = ({ getCountForDate, days, getIntensity }: HeatmapTooltipSectionProps) => {
	return (
		<TooltipProvider>
			<article className="grid grid-flow-col gap-1" style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}>
				{days.map((day, i) => {
					const count = getCountForDate(day);
					return (
						<Tooltip key={i}>
							<TooltipTrigger asChild>
								<button
									type="button"
									className={`w-3 h-3 rounded-sm transition-smooth hover:ring-2 hover:ring-primary hover:scale-110 cursor-pointer ${getIntensity(count)}`}
								/>
							</TooltipTrigger>
							<TooltipContent>
								<p className="font-medium">
									{day.toLocaleDateString('es', {
										day: 'numeric',
										month: 'long',
										year: 'numeric'
									})}
								</p>
								<p className="text-sm text-muted-foreground">{count} mensajes</p>
							</TooltipContent>
						</Tooltip>
					);
				})}
			</article>
		</TooltipProvider>
	);
};
