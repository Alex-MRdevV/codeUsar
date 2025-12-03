import { cleanTablaByRutas } from "@/lib/drizzle/data";
import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";

export const DELETE: APIRoute = async () => {
	try {
		const response = await cleanTablaByRutas.execute();

		return res(
			{
				data: response,
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		return res(
			{
				error: "Error al borrar los datos",
				message: error instanceof Error ? error.message : "Error desconocido",
			},
			{
				status: 200,
			}
		);
	}
};
