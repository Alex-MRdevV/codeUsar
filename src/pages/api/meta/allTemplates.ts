import { getTemplates } from "@/lib/drizzle/templates";
import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
	try {
		// Obtener templates de la base de datos
		const dbTemplates = await getTemplates();

		return res(
			{
				templates: dbTemplates,
				count: dbTemplates.length,
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		return res(
			{
				message: "Error al obtener los templates de la base de datos",
				error: error instanceof Error ? error.message : "Error desconocido",
			},
			{
				status: 500,
			}
		);
	}
};
