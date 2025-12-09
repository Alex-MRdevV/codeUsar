import { ScalaSection } from "@/components/historialGeneral/sections/scaleSection";
import { TooltipSection } from "@/components/historialGeneral/tooltipSection";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CalendarHeatmapProps, DayData } from "@/utils/types/historyGeneral";
import { FileText, MessageSquare, Users } from "lucide-react";
import { useState } from "react";

export const CalendarHeatmap = ({ data }: CalendarHeatmapProps) => {
	const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

	const days = Array.from({ length: 120 }, (_, i) => {
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
		if (count === 0) return "bg-muted dark:bg-muted/40";

		const intensity = Math.ceil((count / maxCount) * 4);

		const intensities = {
			1: "bg-primary/25 dark:bg-primary/30",
			2: "bg-primary/40 dark:bg-primary/45",
			3: "bg-primary/60 dark:bg-primary/70",
			4: "bg-primary dark:bg-primary/90",
		};

		return intensities[intensity as keyof typeof intensities] || "bg-primary dark:bg-primary/80";
	};

	const getDataForDate = (date: Date) => {
		const dateStr = date.toISOString().split('T')[0];
		return data.find(d => d.date === dateStr);
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
				<section className="space-y-2">
					<div className="flex gap-1 text-xs text-muted-foreground mb-2">
						{monthLabels.map((label, i) => (
							<div key={i} style={{ width: "calc(100% / 12)" }}>
								{label}
							</div>
						))}
					</div>

					<TooltipSection
						days={days}
						getCountForDate={getCountForDate}
						getIntensity={getIntensity}
						getDataForDate={getDataForDate}
						setSelectedDay={setSelectedDay}
					/>

					<ScalaSection />
				</section>
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
							{/* Resumen General */}
							<section className="grid grid-cols-3 gap-4">
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
							</section>

							{/* Desglose por Template */}
							{selectedDay.templates && selectedDay.templates.length > 0 && (
								<section className="space-y-3">
									<h3 className="font-display font-semibold text-sm">Mensajes por Template</h3>
									<section className="space-y-2">
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
									</section>
								</section>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>
		</Card>
	);
}
