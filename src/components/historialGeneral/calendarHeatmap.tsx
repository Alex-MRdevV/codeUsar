import { ScalaSection } from "@/components/historialGeneral/sections/scaleSection";
import { TooltipSection } from "@/components/historialGeneral/tooltipSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CalendarHeatmapProps } from "@/utils/types/historyGeneral";

export const CalendarHeatmap = ({ data }: CalendarHeatmapProps) => {
	if (!data || !Array.isArray(data)) {
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
