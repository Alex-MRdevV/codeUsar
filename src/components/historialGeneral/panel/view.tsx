import { DayStatsPanel } from "@/components/historialGeneral/panel/panelStatsByDay";
import { getDataForPanel } from "@/utils/services/history/allDataPanel";
import type { DayStats } from "@/utils/types/historyGeneral";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";

export const PanelStatsByDay = () => {
	const [data, setData] = useState<Record<string, DayStats>>({});
	const [error, setError] = useState<boolean>(false);

	useEffect(() => {
		let mounted = true;

		getDataForPanel().then(([err, days]) => {
			if (!mounted) return;
			if (!days) return

			if (err) {
				setError(true);
			} else {
				// days: DayStats[]
				const map = Object.fromEntries(
					days.map(d => [d.date, d])
				);

				setData(map);
			}
		});

		return () => {
			mounted = false;
		};
	}, []);

	if (!data) return null
	if (error) return <p>Error al cargar los datos</p>;

	const getDayStats = useCallback(
		(date: Date) => {
			const dateStr = format(date, "yyyy-MM-dd");
			return data[dateStr] ?? null;
		},
		[data]
	);

	return (
		<section className="mb-8">
			<DayStatsPanel
				getDayStats={getDayStats}
			/>
		</section>
	)
}
