import { getTemplates } from "@/lib/drizzle/templates";
import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
	try {
		// Obtener los templates ya transformados al tipo Template[]
		const templates = await getTemplates();

		return res(
			{
				templates: templates,
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		return res(
			{
				message: error instanceof Error ? error.message : "Error desconocido",
			},
			{
				status: 500,
			}
		);
	}
};
