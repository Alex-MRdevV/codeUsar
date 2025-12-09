import { DayStatsPanel } from "@/components/historialGeneral/panel/panelStatsByDay";
import { getDataForPanel } from "@/utils/services/history/allDataPanel";
import type { DayStats } from "@/utils/types/historyGeneral";
import { addDays, isAfter, startOfDay, subDays } from "date-fns";
import { useEffect, useState } from "react";

export const PanelStatsByDay = () => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const [data, setData] = useState<DayStats | null>(null);
	const [error, setError] = useState<boolean>(false);

	useEffect(() => {
		let mounted = true;
		getDataForPanel().then(([err, days]) => {
			if (!mounted) return;
			if (err) {
				setError(true);
			} else {
				setData(days);
			}
		});
		return () => {
			mounted = false;
		};
	}, []);

	if (error) return <p>Error al cargar los datos</p>;

	const goToPreviousDay = () => {
		setSelectedDate(prev => subDays(prev, 1));
	};

	const goToNextDay = () => {
		const nextDay = addDays(selectedDate, 1);
		if (!isAfter(startOfDay(nextDay), startOfDay(new Date()))) {
			setSelectedDate(nextDay);
		}
	};

	const isToday = startOfDay(selectedDate).getTime() === startOfDay(new Date()).getTime();

	const handleDateSelect = (date: Date | undefined) => {
		if (date) {
			setSelectedDate(date);
			setIsCalendarOpen(false);
		}
	};

	return (
		<section className="mb-8">
			<DayStatsPanel
				dayStats={data}
				goToNextDay={goToNextDay}
				goToPreviousDay={goToPreviousDay}
				handleDateSelect={handleDateSelect}
				isCalendarOpen={isCalendarOpen}
				isToday={isToday}
				selectedDate={selectedDate}
				setIsCalendarOpen={setIsCalendarOpen}
			/>
		</section>
	)
}
