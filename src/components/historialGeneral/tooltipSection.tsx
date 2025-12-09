import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { HeatmapTooltipSectionProps } from "@/utils/types/historyGeneral";

export const TooltipSection = ({ getCountForDate, days, getIntensity, getDataForDate, setSelectedDay }: HeatmapTooltipSectionProps) => {
	return (
		<TooltipProvider>
			<article className="grid grid-flow-col gap-1" style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}>
				{days.map((day, i) => {
					const count = getCountForDate(day);
					const dayData = getDataForDate(day);
					return (
						<Tooltip key={i}>
							<TooltipTrigger asChild>
								<div
									className={`w-3 h-3 rounded-sm transition-smooth hover:ring-2 hover:ring-primary hover:scale-110 cursor-pointer ${getIntensity(count)}`}
									onClick={() => dayData && setSelectedDay(dayData)}
								/>
							</TooltipTrigger>
							<TooltipContent>
								<p className="font-medium">{day.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
								<p className="text-sm text-muted-foreground">{count} mensajes</p>
							</TooltipContent>
						</Tooltip>
					);
				})}
			</article>
		</TooltipProvider>
	);
};
