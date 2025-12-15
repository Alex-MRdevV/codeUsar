import { urlEnviarMensajeTexto } from "@/lib/providersMensajes/metaUrls";
import { buildMetaRequest } from "@/utils/services/sendMessages";
import type {
	MessageResult,
	RecipientWithParams,
	ReplyFreeTextMessageRequest,
	SendFreeTextMessageRequest,
	SendMessageRequest,
} from "@/utils/types/providers/meta";

export const sendMessagesToAPI = async (
	datos:
		| SendMessageRequest
		| SendFreeTextMessageRequest
		| ReplyFreeTextMessageRequest,
	accessToken: string,
	phoneNumberId: string,
	batchSize: number = 10
): Promise<
	[
		Error | null,
		{
			results: MessageResult[];
			summary: { total: number; success: number; failed: number };
		} | null
	]
> => {
	try {
		const results: MessageResult[] = [];

		// CASO 1: Mensaje de respuesta individual (con replyToMessageId)
		if ("replyToMessageId" in datos) {
			const replyData = datos as ReplyFreeTextMessageRequest;
			const result = await enviarMensajeIndividual(
				replyData.recipient,
				datos,
				accessToken,
				phoneNumberId
			);
			results.push(result);

			const summary = {
				total: 1,
				success: result.status === "success" ? 1 : 0,
				failed: result.status === "error" ? 1 : 0,
			};

			return [null, { results, summary }];
		}

		// CASO 2 y 3: Mensajes masivos (template o text)
		let recipientsArray: RecipientWithParams[] = [];

		// Construir array de destinatarios según el tipo de mensaje
		if (datos.messageType === "template") {
			const templateData = datos as SendMessageRequest;

			if (
				Array.isArray(templateData.recipients) &&
				templateData.recipients.length > 0
			) {
				if (typeof templateData.recipients[0] === "string") {
					// Array de strings → convertir a RecipientWithParams[]
					recipientsArray = (templateData.recipients as string[]).map(
						(phone) => ({
							phone,
							params:
								templateData.parameterFormat === "named"
									? templateData.templateParams || {}
									: templateData.templateParamsPositional || [],
						})
					);
				} else {
					// Ya es RecipientWithParams[]
					recipientsArray = templateData.recipients as RecipientWithParams[];
				}
			}
		} else if (datos.messageType === "text") {
			const textData = datos as SendFreeTextMessageRequest;

			if (
				Array.isArray(textData.recipients) &&
				textData.recipients.length > 0
			) {
				recipientsArray = textData.recipients.map((phone) => ({
					phone,
					params: [],
				}));
			}
		}

		// Validar que hay destinatarios
		if (recipientsArray.length === 0) {
			return [null, { results, summary: { total: 0, success: 0, failed: 0 } }];
		}

		const totalRecipients = recipientsArray.length;

		// Procesar en lotes para respetar rate limits
		for (let i = 0; i < totalRecipients; i += batchSize) {
			const lote = recipientsArray.slice(i, i + batchSize);

			// Crear promesas para el lote actual
			const promesasLote = lote.map((recipient) =>
				enviarMensajeIndividual(recipient, datos, accessToken, phoneNumberId)
			);

			// Ejecutar lote en paralelo con Promise.allSettled
			const resultadosLote = await Promise.allSettled(promesasLote);

			// Procesar resultados del lote
			resultadosLote.forEach((resultado, index) => {
				const recipient = lote[index];
				if (resultado.status === "fulfilled") {
					results.push(resultado.value);
				} else {
					results.push({
						recipient: recipient.phone,
						status: "error",
						errorMessage:
							resultado.reason?.message || "Error desconocido en el envío",
					});
				}
			});

			// Pausa entre lotes (excepto en el último)
			if (i + batchSize < totalRecipients) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
		}

		const summary = {
			total: results.length,
			success: results.filter((r) => r.status === "success").length,
			failed: results.filter((r) => r.status === "error").length,
		};

		return [null, { results, summary }];
	} catch (error) {
		return [error as Error, null];
	}
};

export const enviarMensajeIndividual = async (
	recipient: string | RecipientWithParams,
	datos:
		| SendMessageRequest
		| SendFreeTextMessageRequest
		| ReplyFreeTextMessageRequest,
	accessToken: string,
	phoneNumberId: string
): Promise<MessageResult> => {
	try {
		// Extraer número de teléfono y parámetros personalizados
		const phone = typeof recipient === "string" ? recipient : recipient.phone;
		const customParams =
			typeof recipient === "string" ? undefined : recipient.params;

		const metaRequest = buildMetaRequest(phone, datos, customParams);
		const url = urlEnviarMensajeTexto(phoneNumberId);
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(metaRequest),
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				recipient: phone,
				status: "error",
				errorCode: data.error?.code,
				errorMessage: data.error?.message || "Error desconocido",
			};
		}

		return {
			recipient: phone,
			messageId: data.messages?.[0]?.id,
			status: "success",
		};
	} catch (error) {
		return {
			recipient: typeof recipient === "string" ? recipient : recipient.phone,
			status: "error",
			errorMessage: (error as Error).message,
		};
	}
};
