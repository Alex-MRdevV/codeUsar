import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ cookies }) => {
	try {
		cookies.delete("tokenAcceso");

		return res(null, {
			status: 204,
			statusText: "No Content",
		});
	} catch (error) {
		return res(
			{
				message: "Error interno del servidor",
				error: error instanceof Error ? error.message : "Error desconocido",
			},
			{
				status: 500,
				statusText: "Error interno del servidor",
			}
		);
	}
};
