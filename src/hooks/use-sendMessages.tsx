import { useBatchSender } from "@/hooks/common/use-senderBatch";
import { sendWhatsAppMessage } from "@/lib/providersMensajes/callApi/useApi";
import { cleanData } from "@/utils/services/dataTransitoria/cleanData";
import { cleanDataRuta } from "@/utils/services/dataTransitoria/cleanDataRuta";
import type { FlyingMessage } from "@/utils/types/flyingCards";
import type { clientsInRuta, dataUsar } from "@/utils/types/messages";
import type { ApiResponse, SendMessageRequest } from "@/utils/types/providers/meta";
import type { Template } from "@/utils/types/templates";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface UseSendMessagesLogicProps {
	currentTemplate: Template | null;
	dataClientesRuta: clientsInRuta[] | null;
	dataMensajes: dataUsar[] | null;
	selectedTemplate: string;
	variableValues: Record<string, string>;
}

export const useSendMessagesLogic = ({
	currentTemplate,
	dataClientesRuta,
	dataMensajes,
	selectedTemplate,
	variableValues,
}: UseSendMessagesLogicProps) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [resultados, setResultados] = useState<ApiResponse | null>(null);
	const [flyingMessages, setFlyingMessages] = useState<FlyingMessage[]>([])

	const { isCancelled, sendInBatches, reset, cancel, completed, currentBatch, error, isPaused, isProcessing, pause, progress, resume, totalBatches } = useBatchSender<string>(20);

	// Recipients filtrados por plantilla
	const recipients = useMemo(() => {
		if (!currentTemplate) return [];

		const templateName =
			currentTemplate.metaTemplateName ??
			currentTemplate.name ??
			"";

		if (templateName === "confirmacion_de_pedido") {
			if (!Array.isArray(dataClientesRuta)) return [];

			return dataClientesRuta
				.filter((c) => c.tipoMensaje === "confirmacion_de_pedido")
				.map((c) => c.phoneNumber)
				.filter(Boolean);
		}

		if (!Array.isArray(dataMensajes)) return [];

		return dataMensajes
			.filter((msg) => msg.typeMessage === templateName)
			.map((msg) => msg.phone)
			.filter(Boolean);
	}, [dataMensajes, dataClientesRuta, currentTemplate]);

	const getMessageData = (phoneNumber: string) => {
		return dataMensajes?.find((msg) => msg.phone === phoneNumber) || null;
	};

	const getClientData = (phoneNumber: string) => {
		return dataClientesRuta?.find((client) => client.phoneNumber === phoneNumber) || null;
	};

	// Construye variables automáticas según plantilla y datos
	const buildTemplateVariables = (phoneNumber: string): Record<string, string> => {
		const messageData = getMessageData(phoneNumber);

		if (!messageData) return {};

		const nombreCliente = messageData?.name || "Cliente";

		switch (messageData?.typeMessage) {
			case "pedidos_no_planeados":
			case "pedidos_retrasados":
			case "bavaria_now_confirmar":
				return { "2": nombreCliente };

			case "confirmacion_de_pedido":
				const clientData = getClientData(phoneNumber);
				return {
					"1": clientData?.horaInicial ?? "6:00 am",
					"2": clientData?.horaFinal ?? "6:30 am",
				};

			default:
				return {};
		}
	};

	const buildTemplateParamsArray = (phoneNumber: string): string[] => {
		const templateName = currentTemplate?.metaTemplateName ?? currentTemplate?.name ?? "";

		if (templateName === "confirmacion_de_pedido") {
			const clientData = getClientData(phoneNumber);
			return [
				clientData?.horaInicial ?? "6:00 am",
				clientData?.horaFinal ?? "6:30 am",
			];
		}

		const messageData = getMessageData(phoneNumber);
		if (!messageData) return [];

		const nombreCliente = messageData?.name || "Cliente";

		switch (messageData?.typeMessage) {
			case "pedidos_no_planeados":
			case "pedidos_retrasados":
			case "bavaria_now_confirmar":
				return [nombreCliente];
			default:
				return [];
		}
	};

	const buildPayload = (recipient: string): SendMessageRequest => {
		if (!currentTemplate) throw new Error("No hay template seleccionado");

		const templateVars = currentTemplate.variables ?? {};
		const paramsList = Array.isArray((templateVars as any).params)
			? (templateVars as any).params
			: [];
		const rawFormat = (templateVars as any).format;
		const isPositional =
			rawFormat?.toUpperCase?.() === "POSITIONAL" ||
			rawFormat === "positional";

		const templateNameToUse =
			currentTemplate.metaTemplateName ?? currentTemplate.name;

		const shouldUseVariableValues =
			templateNameToUse !== "pedidos_in_ruta" &&
			Object.keys(variableValues ?? {}).length > 0;

		let formattedParams: string[];

		if (isPositional) {
			if (shouldUseVariableValues) {
				formattedParams = [...paramsList]
					.sort((a, b) => Number(a.name) - Number(b.name))
					.map((p) => variableValues[p.name] || "");
			} else {
				const params = buildTemplateParamsArray(recipient);
				formattedParams = params;
			}
		} else {
			formattedParams = shouldUseVariableValues
				? Object.values(variableValues)
				: Object.values(buildTemplateVariables(recipient));
		}

		const needsHeaderParams = templateNameToUse === "confirmar_pedido";

		return {
			templateId: currentTemplate.id,
			messageType: "template",
			templateName: templateNameToUse,
			templateLanguage: currentTemplate.language || "es_CO",
			parameterFormat: "positional",
			recipients: [
				{
					phone: recipient,
					params: formattedParams,
				},
			],
			templateParamsPositional: formattedParams,
			...(needsHeaderParams && { headerParams: formattedParams }),
		};
	};

	const canSend = (): boolean => {
		if (!selectedTemplate || isSubmitting) return false;
		if (!dataMensajes) return false;
		if (recipients.length === 0) return false;

		if (currentTemplate?.variables && Object.keys(variableValues).length > 0) {
			return currentTemplate.variables.params.every(
				(param: any) => (variableValues[param.name] ?? "").trim().length > 0
			);
		}

		return true;
	};

	const createInitialFlyingMessages = (list: string[]) => {
		setFlyingMessages((prev) => [
			...prev,
			...list.map((phone) => ({
				id: crypto.randomUUID(),
				recipient: phone,
			})),
		]);
	};

	const markFlyingSent = (recipient: string) => {
		setFlyingMessages((prev) =>
			prev.map((m) =>
				m.recipient === recipient && m.status === "sending"
					? { ...m, status: "sent" }
					: m
			)
		);
	};

	const markFlyingError = (recipient: string) => {
		setFlyingMessages((prev) =>
			prev.map((m) =>
				m.recipient === recipient && m.status === "sending"
					? { ...m, status: "error", errorCode: 500 }
					: m
			)
		);
	};


	const handleSendMessages = async () => {
		if (!currentTemplate) {
			toast.error("Selecciona una plantilla");
			return;
		}

		const recipientsList = recipients;
		if (recipientsList.length === 0) {
			toast.error("No hay destinatarios para esta plantilla");
			return;
		}

		createInitialFlyingMessages(recipientsList);

		setIsSubmitting(true);
		setResultados(null);

		try {
			let successCount = 0;
			let errorCount = 0;

			await sendInBatches(
				recipientsList,
				async (batch) => {
					for (const phone of batch) {
						try {
							const payload = buildPayload(phone);
							console.log(payload)
							await sendWhatsAppMessage(payload);
							successCount++;
							markFlyingSent(phone);
						} catch (err) {
							errorCount++;
							markFlyingError(phone);
						}
					}
					await new Promise((r) => setTimeout(r, 500));
				},
				1000
			);

			if (isCancelled) {
				toast.warning(`Envío cancelado. Enviados: ${successCount}, Fallidos: ${errorCount}`);
			} else if (errorCount > 0 && successCount > 0) {
				toast.warning(`Envío parcial: ${successCount} exitosos, ${errorCount} fallidos`);
			} else if (errorCount > 0) {
				toast.error("Ocurrió un error, no se pudo enviar ningún mensaje");
			} else {
				toast.success(`✓ ${successCount} mensajes enviados exitosamente`);
			}

			if (errorCount === 0 && !isCancelled) {
				try {
					await Promise.all([cleanData(), cleanDataRuta()]);
					toast.success("✓ Datos limpiados correctamente");
				} catch (cleanError) {
					toast.warning("Mensajes enviados, pero hubo un error al limpiar los datos");
				}

				return { shouldCleanState: true };
			}

			return { shouldCleanState: false };
		} catch (err: any) {
			toast.error("Error crítico en el envío de mensajes");
			return { shouldCleanState: false };
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetResultados = () => {
		setResultados(null);
	};

	const getRecipientCount = () => recipients.length;

	return {
		recipients,
		isSubmitting,
		resultados,
		canSend,
		handleSendMessages,
		resetResultados,
		getRecipientCount,
		reset,
		cancel, completed, currentBatch, error, isPaused, isProcessing, pause, progress, resume, totalBatches,
		isCancelled,
		flyingMessages
	};
};
