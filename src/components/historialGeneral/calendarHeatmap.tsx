import { ScalaSection } from "@/components/historialGeneral/sections/scaleSection";
import { TooltipSection } from "@/components/historialGeneral/tooltipSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CalendarHeatmapProps } from "@/utils/types/historyGeneral";

export const CalendarHeatmap = ({ data }: CalendarHeatmapProps) => {
	const dataArray = data ? Array.from(data) : [];

	if (!dataArray || dataArray.length === 0) {
		return <p>Cargando datos del calendario...</p>;
	}

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
		<Card className="shadow-lg border-0 backdrop-blur-sm bg-linear-to-r from-purple-400 to-pink-800">
			<CardHeader>
				<CardTitle className="font-display text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600">Actividad de mensajes</CardTitle>
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
					/>

					<ScalaSection />
				</section>
			</CardContent>
		</Card>
	);
}
