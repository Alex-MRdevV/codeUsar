import { allClientMensajes } from "@/lib/drizzle/data";
import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({}) => {
	try {
		const dataClientes = await allClientMensajes();

		return res(
			{
				message: "Todo salio bien",
				data: dataClientes,
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		return res(
			{ message: "Error al obtener los datos" },
			{
				status: 500,
			}
		);
	}
};
