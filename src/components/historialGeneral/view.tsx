import { MetricCardSection } from "@/components/historialGeneral/sections/metricCards";
import { LoadingWrapper } from "@/components/loading/wrapper";
import { getDataForDays } from "@/utils/services/history/allDataByDate";
import { getTemplatesForMetrics } from "@/utils/services/templates/allDataForMetrics";
import type { HeatmapDataPoint, TrendMetric } from "@/utils/types/historyGeneral";
import type { TemplateForMetrics } from "@/utils/types/templates";
import { useEffect, useState } from "react";

export const ViewHistoryGeneral = () => {
	const [data, setData] = useState<TemplateForMetrics[] | null>(null);
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
	if (!data || !dataDays) {
		return <LoadingWrapper isLoading={true} message="Cargando..." />
	}

	const totalMessages = data.reduce(
		(total, template) => total + template.messagesSent,
		0
	);

	// Transformar a TrendDataPoint
	const trendData = dataDays.map(day => ({
		date: day.date,
		messages: day.count,
	}));

	// Calcular totalTrend comparando últimos 7 días vs 7 días anteriores
	const calculateTotalTrend = (): TrendMetric => {
		if (dataDays.length < 2) {
			return { value: 0, isPositive: true };
		}

		// Ordenar por fecha descendente (más reciente primero)
		const sortedDays = [...dataDays].sort((a, b) =>
			new Date(b.date).getTime() - new Date(a.date).getTime()
		);

		// Tomar los últimos 7 días
		const recentDays = sortedDays.slice(0, 7);
		const previousDays = sortedDays.slice(7, 14);

		// Calcular totales
		const recentTotal = recentDays.reduce((sum, day) => sum + day.count, 0);
		const previousTotal = previousDays.reduce((sum, day) => sum + day.count, 0);

		// Calcular porcentaje de cambio
		if (previousTotal === 0) {
			return {
				value: recentTotal > 0 ? 100 : 0,
				isPositive: recentTotal > 0
			};
		}

		const percentageChange = ((recentTotal - previousTotal) / previousTotal) * 100;

		return {
			value: Math.abs(Math.round(percentageChange)),
			isPositive: percentageChange >= 0
		};
	};

	const totalTrend = calculateTotalTrend();
	const uniqueNumbers = dataDays.reduce(
		(acc, day) => acc + (day.uniqueNumbers ?? 0),
		0
	);

	return (
		<section className="container mx-auto px-4 py-8 max-w-7xl">
			<MetricCardSection
				templatesData={data}
				totalMessages={totalMessages}
				heatmapData={dataDays}
				trendData={trendData}
				totalTrend={totalTrend}
				uniqueNumbers={uniqueNumbers}
			/>
		</section>
	);
};
