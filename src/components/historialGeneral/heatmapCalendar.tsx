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
		if (count === 0)
			return "bg-zinc-700/30 dark:bg-zinc-600/20";

		const intensity = Math.ceil((count / maxCount) * 4);

		const intensities = {
			1: "bg-purple-500/40 dark:bg-purple-500/50",     // bajo
			2: "bg-fuchsia-500/50 dark:bg-fuchsia-500/60",   // medio
			3: "bg-pink-500/70 dark:bg-pink-500/80",         // alto
			4: "bg-orange-500 dark:bg-orange-600",           // máximo
		};

		return intensities[intensity as keyof typeof intensities];
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
		<Card className="shadow-lg border-0 bg-linear-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-sm">
			<CardHeader>
				<CardTitle className="font-display">Actividad de mensajes</CardTitle>
			</CardHeader>
			<CardContent>
				<section className="space-y-2 rounded-xl p-3 bg-white/20 dark:bg-zinc-800/20
    backdrop-blur-md">
					<div className="flex gap-1 text-xs text-muted-foreground mb-2 ">
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
								{/* Mensajes = ROJO */}
								<div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-red-500/10 dark:bg-red-500/20 border border-red-500/30">
									<MessageSquare className="h-5 w-5 text-red-500" />
									<div className="text-center">
										<p className="text-2xl font-bold font-display">{selectedDay.count}</p>
										<p className="text-xs text-muted-foreground">Mensajes</p>
									</div>
								</div>

								{/* Templates = AZUL */}
								<div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30">
									<FileText className="h-5 w-5 text-blue-500" />
									<div className="text-center">
										<p className="text-2xl font-bold font-display">{selectedDay.templates?.length || 0}</p>
										<p className="text-xs text-muted-foreground">Templates</p>
									</div>
								</div>

								{/* Números únicos = VERDE */}
								<div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-green-500/10 dark:bg-green-500/20 border border-green-500/30">
									<Users className="h-5 w-5 text-green-500" />
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
