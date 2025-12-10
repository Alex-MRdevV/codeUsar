import { db } from "@/db/db";
import { clientesEnRuta } from "@/db/schemaTransitional/dataUsar";
import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";

export const DELETE: APIRoute = async () => {
	try {
		const results = await db.delete(clientesEnRuta);

		return res(
			{
				data: results,
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
				status: 500,
			}
		);
	}
};
