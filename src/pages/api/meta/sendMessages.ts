import { sendWhatsAppMessages } from "@/lib/providersMensajes/sendMessages";
import { res } from "@/utils/responseAstro";
import type { SendMessageRequest } from "@/utils/types/providers/meta";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, locals }) => {
	const { env } = locals.runtime;
	const PHONE_NUMBER_ID = env.WHATSAPP_PHONE_NUMBER_ID;
	const ACCESS_TOKEN = env.WHATSAPP_ACCESS_TOKEN;

	if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
		return res(
			{
				message: "Las variables de entorno no están definidas",
			},
			{
				status: 401,
			}
		);
	}

	const jsonData: SendMessageRequest = await request.json();

	try {
		const [error, result] = await sendWhatsAppMessages(
			jsonData,
			ACCESS_TOKEN,
			PHONE_NUMBER_ID
		);

		if (error) {
			return res(
				{
					message: "Error al enviar mensajes",
					error: error.message,
				},
				{
					status: 500,
				}
			);
		}

		return res(
			{
				message: "Mensajes enviados exitosamente",
				data: result,
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		return res(
			{
				message: "Error interno del servidor",
				error: (error as Error).message,
			},
			{
				status: 500,
			}
		);
	}
};
