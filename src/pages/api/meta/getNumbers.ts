import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ locals }) => {
	const { env } = locals.runtime;

	if (!env.KV) {
		return res(
			{
				message: "Variables de entorno no configuradas",
			},
			{ status: 401 }
		);
	}

	try {
		const storedData = await env.KV.get("phones", "json");

		if (!storedData) {
			return res(
				{
					message: "No hay datos disponibles",
					data: null,
				},
				{
					status: 404,
				}
			);
		}

		return res(
			{
				message: "Datos recuperados exitosamente",
				data: storedData,
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		return res(
			{
				message: "Error al recuperar los datos",
				error: (error as Error).message,
			},
			{
				status: 500,
			}
		);
	}
};
