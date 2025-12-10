import { getAllClientesByRuta } from "@/lib/drizzle/data";
import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({}) => {
	try {
		const dataClientes = await getAllClientesByRuta();

		return res(
			{
				data: dataClientes,
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		console.log(error)
		return res(
			{ message: "Error al obtener los datos" },
			{
				status: 500,
			}
		);
	}
};
