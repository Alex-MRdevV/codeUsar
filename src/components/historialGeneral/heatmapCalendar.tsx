
/*import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileText, Users } from "lucide-react";

interface TemplateDetail {
	id: string;
	name: string;
	color: string;
	messagesSent: number;
}

interface DayData {
	date: string;
	count: number;
	templates?: TemplateDetail[];
	uniqueNumbers?: number;
}

interface CalendarHeatmapProps {
	data: DayData[];
}

export function CalendarHeatmap({ data }: CalendarHeatmapProps) {
	const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

	// Get last 84 days (12 weeks)
	const days = Array.from({ length: 84 }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - (83 - i));
		return date;
	});

	const getDataForDate = (date: Date) => {
		const dateStr = date.toISOString().split('T')[0];
		return data.find(d => d.date === dateStr);
	};

	const getCountForDate = (date: Date) => {
		return getDataForDate(date)?.count || 0;
	};

	const maxCount = Math.max(...data.map(d => d.count), 1);

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

			<Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle className="font-display text-2xl">
							{selectedDay && new Date(selectedDay.date).toLocaleDateString('es', {
								day: 'numeric',
								month: 'long',
								year: 'numeric'
							})}
						</DialogTitle>
					</DialogHeader>

					{selectedDay && (
						<div className="space-y-6">
							{/* Resumen General *//*}
							<div className="grid grid-cols-3 gap-4">
								<div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-primary/5 border border-primary/10">
									<MessageSquare className="h-5 w-5 text-primary" />
									<div className="text-center">
										<p className="text-2xl font-bold font-display">{selectedDay.count}</p>
										<p className="text-xs text-muted-foreground">Mensajes</p>
									</div>
								</div>

								<div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-accent/5 border border-accent/10">
									<FileText className="h-5 w-5 text-accent" />
									<div className="text-center">
										<p className="text-2xl font-bold font-display">{selectedDay.templates?.length || 0}</p>
										<p className="text-xs text-muted-foreground">Templates</p>
									</div>
								</div>

								<div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-chart-3/5 border border-chart-3/10">
									<Users className="h-5 w-5 text-chart-3" />
									<div className="text-center">
										<p className="text-2xl font-bold font-display">{selectedDay.uniqueNumbers || 0}</p>
										<p className="text-xs text-muted-foreground">Números</p>
									</div>
								</div>
							</div>

							{/* Desglose por Template *//*}
							{selectedDay.templates && selectedDay.templates.length > 0 && (
								<div className="space-y-3">
									<h3 className="font-display font-semibold text-sm">Mensajes por Template</h3>
									<div className="space-y-2">
										{selectedDay.templates.map((template) => (
											<div
												key={template.id}
												className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-smooth"
											>
												<div className="flex items-center gap-3">
													<div
														className="w-3 h-3 rounded-full"
														style={{ backgroundColor: template.color }}
													/>
													<span className="font-medium text-sm">{template.name}</span>
												</div>
												<Badge variant="secondary" className="font-display">
													{template.messagesSent} mensajes
												</Badge>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>
		</Card>
	);
}
*/
