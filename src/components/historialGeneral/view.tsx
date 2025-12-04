import { getDataForDays } from "@/utils/services/templates/allDataByDate";
import { getTemplatesForMetrics } from "@/utils/services/templates/allDataForMetrics";
import type { HeatmapDataPoint, TemplateStats } from "@/utils/types/history";
import { useEffect, useState } from "react";
import { MetricCardSection } from "./sections/metricCards";
import { CalendarHeatmap } from "./calendarHeatmap";

export const ViewHistoryGeneral = () => {
	const [data, setData] = useState<TemplateStats[] | null>(null);
	const [dataDays, setDataDays] = useState<HeatmapDataPoint[] | null>(null);
	const [error, setError] = useState<boolean>(false);

	useEffect(() => {
		let mounted = true;

		getTemplatesForMetrics().then(([err, templates]) => {
			if (!mounted) return;
			if (err) {
				setError(true);
			} else {
				setData(templates);
			}
		});

		getDataForDays().then(([err, heatmapData]) => {
			if (!mounted) return;
			if (err) {
				setError(true);
			} else {
				setDataDays(heatmapData);
			}
		});

		return () => {
			mounted = false;
		};
	}, []);

	if (error) return <p>Error al cargar los datos</p>;
	if (!data || !dataDays) return <p>Cargando...</p>;

	const totalMessages = data.reduce(
		(total, template) => total + template.messagesSent,
		0
	);

	// Transformar a TrendDataPoint (ya está tipado correctamente)
	const trendData = dataDays.map(day => ({
		date: day.date,
		messages: day.count,
	}));

	return (
		<section className="container mx-auto px-4 py-8 max-w-7xl">
			<MetricCardSection
				templatesData={data}
				totalMessages={totalMessages}
				heatmapData={dataDays}
				trendData={trendData}
			/>
			<CalendarHeatmap data={dataDays} />
		</section>
	);
};
