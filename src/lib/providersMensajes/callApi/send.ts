import { urlEnviarMensajeTexto } from "@/lib/providersMensajes/metaUrls";
import { buildMetaRequest } from "@/lib/providersMensajes/sendMessages";
import type {
	MessageResult,
	SendMessageRequest,
} from "@/utils/types/providers/meta";

export const sendMessagesToAPI = async (
	datos: SendMessageRequest,
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
		const totalRecipients = datos.recipients.length;

		// Procesar en lotes
		for (let i = 0; i < totalRecipients; i += batchSize) {
			const lote = datos.recipients.slice(i, i + batchSize);

			// Crear promesas para el lote actual
			const promesasLote = lote.map(recipient =>
				enviarMensajeIndividual(recipient, datos, accessToken, phoneNumberId)
			);

			// Ejecutar lote en paralelo con Promise.allSettled para capturar todos los resultados
			const resultadosLote = await Promise.allSettled(promesasLote);

			// Procesar resultados del lote
			resultadosLote.forEach((resultado, index) => {
				const recipient = lote[index];

				if (resultado.status === "fulfilled") {
					results.push(resultado.value);
				} else {
					results.push({
						recipient,
						status: "error",
						errorMessage: resultado.reason?.message || "Error desconocido en el envío",
					});
				}
			});

			// Pausa entre lotes para respetar rate limits (excepto en el último lote)
			if (i + batchSize < totalRecipients) {
				await new Promise(resolve => setTimeout(resolve, 1000)); // 1 segundo entre lotes
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

const enviarMensajeIndividual = async (
	recipient: string,
	datos: SendMessageRequest,
	accessToken: string,
	phoneNumberId: string
): Promise<MessageResult> => {
	try {
		const metaRequest = buildMetaRequest(recipient, datos);
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
				recipient,
				status: "error",
				errorCode: data.error?.code,
				errorMessage: data.error?.message || "Error desconocido",
			};
		}

		return {
			recipient,
			messageId: data.messages?.[0]?.id,
			status: "success",
		};
	} catch (error) {
		return {
			recipient,
			status: "error",
			errorMessage: (error as Error).message,
		};
	}
};
