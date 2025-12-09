import { DayStatsPanel } from "@/components/historialGeneral/panel/panelStatsByDay";
import { getDataForPanel } from "@/utils/services/history/allDataPanel";
import type { DayStats } from "@/utils/types/historyGeneral";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";

export const PanelStatsByDay = () => {
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

	const getDayStats = useCallback(
		(date: Date) => {
			if (!data) return null;

			const dateStr = format(date, "yyyy-MM-dd");

			// Busca en tu respuesta real del backend
			if (data.date === dateStr) {
				return data;
			}

			return null;
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
