import { HeaderPanel } from "@/components/historialGeneral/panel/header";
import { TemplateList } from "@/components/historialGeneral/panel/templatesList";
import { Card, CardContent } from "@/components/ui/card";
import type { DayStatsPanelProps } from "@/utils/types/historyGeneral";
import { addDays, format, isAfter, startOfDay, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { MessageSquare } from "lucide-react";
import { useMemo, useState } from "react";

export const DayStatsPanel = ({ getDayStats }: DayStatsPanelProps) => {
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	const dayStats = useMemo(
		() => getDayStats(selectedDate),
		[selectedDate, getDayStats]
	);

	const goToPreviousDay = () => {
		setSelectedDate(prev => subDays(prev, 1));
	};

	const goToNextDay = () => {
		const nextDay = addDays(selectedDate, 1);
		if (!isAfter(startOfDay(nextDay), startOfDay(new Date()))) {
			setSelectedDate(nextDay);
		}
	};

	const isToday =
		startOfDay(selectedDate).getTime() ===
		startOfDay(new Date()).getTime();

	const handleDateSelect = (date: Date | undefined) => {
		if (date) {
			setSelectedDate(date);
			setIsCalendarOpen(false);
		}
	};

	return (
		<Card className="shadow-elegant border-border/50 overflow-hidden">
			<HeaderPanel
				goToNextDay={goToNextDay}
				goToPreviousDay={goToPreviousDay}
				handleDateSelect={handleDateSelect}
				isCalendarOpen={isCalendarOpen}
				isToday={isToday}
				selectedDate={selectedDate}
				setIsCalendarOpen={setIsCalendarOpen}
			/>

			<CardContent className="pt-6">
				{dayStats && dayStats.totalMessages > 0 ? (
					<TemplateList
						templates={dayStats.templates}
					/>
				) : (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<div className="p-4 rounded-full bg-muted/50 mb-4">
							<MessageSquare className="h-8 w-8 text-muted-foreground" />
						</div>
						<h3 className="font-display font-semibold text-lg mb-1">Sin actividad</h3>
						<p className="text-sm text-muted-foreground max-w-xs">
							No se enviaron mensajes el {format(selectedDate, "d 'de' MMMM", { locale: es })}
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
