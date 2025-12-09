import {
	getDataForDaysWithTemplates,
	getUniqueNumbersByDay,
} from "@/lib/drizzle/templates";
import { res } from "@/utils/responseAstro";
import type { HeatmapDataPoint } from "@/utils/types/historyGeneral";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
	try {
		// Obtener datos agrupados por día y template
		const dataByDay = await getDataForDaysWithTemplates.execute();

		// Obtener números únicos por día
		const uniqueNumbersData = await getUniqueNumbersByDay.execute();

		// Crear un mapa para números únicos
		const uniqueNumbersMap = new Map(
			uniqueNumbersData.map((item) => [item.date, item.uniqueNumbers])
		);

		// Agrupar datos por fecha
		const groupedByDate = dataByDay.reduce((acc, item) => {
			if (!acc[item.date]) {
				acc[item.date] = {
					date: item.date,
					count: 0,
					templates: [],
					uniqueNumbers: uniqueNumbersMap.get(item.date) || 0,
				};
			}

			acc[item.date].count += item.count || 0;

			// Solo agregar si el template existe
			if (item.templateId) {
				acc[item.date].templates.push({
					id: item.templateId,
					name: item.templateName || "",
					color: item.templateColor || "#000000",
					messagesSent: item.count,
				});
			}

			return acc;
		}, {} as Record<string, HeatmapDataPoint>);

		// Convertir a array y ordenar
		const heatmapData: HeatmapDataPoint[] = Object.values(groupedByDate).sort(
			(a, b) => a.date.localeCompare(b.date)
		);

		return res(
			{
				data: heatmapData,
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		return res(
			{
				error: "Error al obtener los datos",
				message: error instanceof Error ? error.message : "Error desconocido",
			},
			{
				status: 500,
			}
		);
	}
};
