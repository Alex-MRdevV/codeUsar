import { getDayStats } from "@/lib/drizzle/templates";
import { res } from "@/utils/responseAstro";
import type { TemplateBreakdown } from "@/utils/types/historyGeneral";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
	try {
		const data = await getDayStats.execute();
		const parsedData = data.map((item) => ({
			...item,
			templates: JSON.parse(item.templates) as TemplateBreakdown[],
		}));

		return res(
			{
				data: parsedData,
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
