import { getTemplatesForMetrics } from "@/lib/drizzle/templates";
import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
	try {
		// Obtener templates con métricas
		const response = await getTemplatesForMetrics.execute();

		return res(
			{
				data: response, // Este debe ser TemplateForMetrics[]
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
