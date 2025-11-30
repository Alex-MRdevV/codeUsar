import { sendMessagesToAPI } from "@/lib/providersMensajes/apiMeta/send";
import { validateSendMessageRequest } from "@/lib/providersMensajes/validateMessage";
import { res } from "@/utils/responseAstro";
import type { SendMessageRequest } from "@/utils/types/providers/meta";
import { uuid } from "@/utils/uuid";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, locals }) => {
	const { env } = locals.runtime;
	const PHONE_NUMBER_ID = env.WHATSAPP_PHONE_ID;
	const ACCESS_TOKEN = env.WHATSAPP_ACCESS_TOKEN;

	// Validar variables de entorno
	if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
		return res(
			{ message: "Las variables de entorno no están definidas" },
			{ status: 401 }
		);
	}

	let jsonData: SendMessageRequest;
	try {
		jsonData = await request.json();
	} catch (error) {
		return res(
			{ message: "JSON inválido en el cuerpo de la solicitud" },
			{ status: 400 }
		);
	}

	// Validaciones del request
	const validationError = validateSendMessageRequest(jsonData);
	if (validationError) return validationError;

	try {
		// Enviar mensajes
		const [error, result] = await sendMessagesToAPI(
			jsonData,
			ACCESS_TOKEN,
			PHONE_NUMBER_ID,
			15 // batchSize explícito
		);

		if (error) {
			return res(
				{
					message: "Error al enviar mensajes",
					error: error.message,
				},
				{ status: 500 }
			);
		}

		if (result?.results.map((item) => item.status === "error")) {
			return res(
				{
					message: "Error al enviar mensajes",
					error: "Algo ha fallado al enviar el mensaje",
				},
				{ status: 400 }
			);
		}

		

		return res(
			{
				message: "Mensajes enviados exitosamente",
				data: result,
			},
			{ status: 200 }
		);
	} catch (error) {
		return res(
			{
				message: "Error interno del servidor",
				error: (error as Error).message,
			},
			{ status: 500 }
		);
	}
};
