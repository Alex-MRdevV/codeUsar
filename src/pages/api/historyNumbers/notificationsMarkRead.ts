import { markNotificationAsRead } from "@/lib/drizzle/historyNumbers";
import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
	try {
		const jsonData = await request.json();
		await markNotificationAsRead(jsonData);
		return res(
			{
				message: "Notificación marcada como leída",
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
