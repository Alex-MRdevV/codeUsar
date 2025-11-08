import { urlEnviarMensajeTexto } from "@/lib/providersMensajes/metaUrls";
import type {
	Component,
	MetaRequest,
	SendMessageRequest,
	TextParameter,
} from "@/utils/types/providers/meta";

const buildMetaRequest = (
	recipient: string,
	request: SendMessageRequest
): MetaRequest => {
	const baseRequest: MetaRequest = {
		messaging_product: "whatsapp",
		recipient_type: "individual",
		to: recipient,
		type: request.messageType,
	};

	if (request.messageType === "text" && request.content) {
		baseRequest.text = {
			preview_url: false,
			body: request.content,
		};
	} else if (request.messageType === "template" && request.templateName) {
		const components: Component[] = [];

		// Si hay parámetros de plantilla, agregarlos al componente body
		if (request.templateParams && request.templateParams.length > 0) {
			const parameters: TextParameter[] = request.templateParams.map(
				(param) => ({
					type: "text",
					text: param,
				})
			);

			components.push({
				type: "body",
				parameters,
			});
		}

		baseRequest.template = {
			name: request.templateName,
			language: {
				code: request.templateLanguage || "es",
			},
			components,
		};
	}

	return baseRequest;
};

export const sendWhatsAppMessages = async (
	request: SendMessageRequest,
	accessToken: string,
	phoneNumberId: string
): Promise<[Error | null, any | null]> => {
	try {
		const results = [];
		const errors = [];

		// Enviar mensaje a cada destinatario
		for (const recipient of request.recipients) {
			try {
				const metaRequest = buildMetaRequest(recipient, request);
				const url = urlEnviarMensajeTexto(phoneNumberId);

				const response = await fetch(url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
					body: JSON.stringify(metaRequest),
				});

				if (!response.ok) {
					const errorData = await response.json();
					errors.push({
						recipient,
						error: errorData.error?.message || "Error desconocido",
						code: errorData.error?.code,
					});
					continue;
				}

				const data = await response.json();
				results.push({
					recipient,
					messageId: data.messages?.[0]?.id,
					success: true,
				});
			} catch (error) {
				errors.push({
					recipient,
					error: (error as Error).message,
				});
			}
		}

		// Si hubo algún error, retornarlo
		if (errors.length > 0) {
			return [
				new Error(
					`Errores al enviar mensajes: ${JSON.stringify(errors, null, 2)}`
				),
				{ results, errors },
			];
		}

		return [null, { results, errors: [] }];
	} catch (error) {
		return [error as Error, null];
	}
};
