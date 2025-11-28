import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { CalendarHeatmapProps } from "@/utils/types/historyGeneral";

export const CalendarHeatmap = ({ data }: CalendarHeatmapProps) => {
	// Get last 84 days (12 weeks)
	const days = Array.from({ length: 84 }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - (83 - i));
		return date;
	});

	const maxCount = Math.max(...data.map(d => d.count), 1);
	const getCountForDate = (date: Date) => {
		const dateStr = date.toISOString().split('T')[0];
		const found = data.find(d => d.date === dateStr);
		return found?.count || 0;
	};

	const getIntensity = (count: number) => {
		if (count === 0) return "bg-muted";
		const intensity = Math.ceil((count / maxCount) * 4);
		const intensities = {
			1: "bg-primary/20",
			2: "bg-primary/40",
			3: "bg-primary/60",
			4: "bg-primary",
		};
		return intensities[intensity as keyof typeof intensities] || "bg-primary";
	};

	const weeks = [];
	for (let i = 0; i < days.length; i += 7) {
		weeks.push(days.slice(i, i + 7));
	}

	const monthLabels = weeks.map((week, i) => {
		if (i === 0 || week[0].getDate() <= 7) {
			return week[0].toLocaleDateString('es', { month: 'short' });
		}
		return null;
	});

	return (
		<Card className="shadow-elegant border-border/50">
			<CardHeader>
				<CardTitle className="font-display">Actividad de mensajes</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					<div className="flex gap-1 text-xs text-muted-foreground mb-2">
						{monthLabels.map((label, i) => (
							<div key={i} style={{ width: "calc(100% / 12)" }}>
								{label}
							</div>
						))}
					</div>

					<TooltipProvider>
						<div className="grid grid-flow-col gap-1" style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}>
							{days.map((day, i) => {
								const count = getCountForDate(day);
								return (
									<Tooltip key={i}>
										<TooltipTrigger asChild>
											<div
												className={`w-3 h-3 rounded-sm transition-smooth hover:ring-2 hover:ring-primary hover:scale-110 cursor-pointer ${getIntensity(count)}`}
											/>
										</TooltipTrigger>
										<TooltipContent>
											<p className="font-medium">{day.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
											<p className="text-sm text-muted-foreground">{count} mensajes</p>
										</TooltipContent>
									</Tooltip>
								);
							})}
						</div>
					</TooltipProvider>

					<div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
						<span>Menos</span>
						<div className="flex gap-1">
							<div className="w-3 h-3 rounded-sm bg-muted" />
							<div className="w-3 h-3 rounded-sm bg-primary/20" />
							<div className="w-3 h-3 rounded-sm bg-primary/40" />
							<div className="w-3 h-3 rounded-sm bg-primary/60" />
							<div className="w-3 h-3 rounded-sm bg-primary" />
						</div>
						<span>Más</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
