import { getDayStats } from "@/lib/drizzle/templates";
import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
	try {
		const [data] = await getDayStats.execute();

		return res(
			{
				data: data,
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
