import { getCalendarData } from "@/lib/drizzle/history";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({}) => {
	try {
		// Obtener ambas fuentes de datos
		const response = await getCalendarData.execute();

		return new Response(JSON.stringify(response), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		return new Response(
			JSON.stringify({
				error: "Error al obtener los datos",
				message: error instanceof Error ? error.message : "Error desconocido",
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}
};
