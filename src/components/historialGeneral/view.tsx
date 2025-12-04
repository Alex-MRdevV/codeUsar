import { getTemplatesForMetrics } from "@/utils/services/templates/allDataForMetrics";
import type { TemplateForMetrics } from "@/utils/types/templates";
import { useEffect, useState } from "react";
import { MetricCardSection } from "./sections/metricCards";
import { CalendarHeatmap } from "./calendarHeatmap";
import { getDataForDays } from "@/utils/services/templates/allDataByDate";
import type { CalendarHeatmapProps, DayData, } from "@/utils/types/historyGeneral";

export const ViewHistoryGeneral = () => {
	const [data, setData] = useState<TemplateForMetrics[] | null>(null);
	console.log(data)
	const [dataDays, setDataDays] = useState<DayData[] | null>(null);
	const [error, setError] = useState<boolean>(false);

	useEffect(() => {
		let mounted = true;

		getTemplatesForMetrics().then(([err, templates]) => {
			if (!mounted) return;
			if (err) setError(true);
			else setData(templates);
		});

		getDataForDays().then(([err, templates]) => {
			if (!mounted) return;
			if (err) setError(true);
			else setDataDays(templates);
		});

		return () => {
			mounted = false; // evita actualizaciones dobles
		};
	}, []);

	if (error) return <p>Error</p>;
	if (!data) return <p>Cargando...</p>;
	if (!dataDays) return <p>Cargando...</p>;

	const totalMessages = data.reduce(
		(total: number, template: { messagesSent: number }) => total + template.messagesSent,
		0
	);

	return (
		<section className="container mx-auto px-4 py-8 max-w-7xl">
			<MetricCardSection
				templatesData={data}
				totalMessages={totalMessages}
			/>
			<CalendarHeatmap
				data={dataDays}
			/>
		</section>
	)
}
