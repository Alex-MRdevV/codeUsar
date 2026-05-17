import type { SendMessageRequest } from "@/utils/types/providers/meta";
import type { TemplateVars, UseSendMessagesLogicProps } from "@/utils/types/send";
import { useMemo } from "react";

export const useMessagesLogicTemplates = (
	props: UseSendMessagesLogicProps | null
) => {
	if (!props) {
		return {
			recipients: [] as string[],
			buildPayload: () => {
				throw new Error("useMessagesLogicTemplates: props is null");
			},
			canSend: () => false,
			getRecipientCount: () => 0,
		};
	}

	const {
		currentTemplate,
		dataClientesRuta,
		dataMensajes,
		selectedTemplate,
		variableValues,
	} = props;

	const getWhatsAppTemplateName = (internalName: string): string => {
		const templateMap: Record<string, string> = {
			pedidosEnRUTADOS: "confirmacion_de_pedido",
			"bavaria_now_confirmar": "confirmar_pedidos_bavaria",
			"pedidos_retrasados": "pedidos_retrasados",
			"cambio_frecuencia": "cambio_frecuencia",
			"lunes_aplazados": "lunes_aplazados"
		};

		return templateMap[internalName] || internalName;
	};

	// Templates que tienen parámetros en el HEADER
	const templatesWithHeaderParams = [
		"bavaria_now_confirmar",
		"cambio_frecuencia"
	];

	// Recipients filtrados por plantilla
	const recipients = useMemo(() => {
		if (!currentTemplate) return [];

		const templateName =
			currentTemplate.metaTemplateName ??
			currentTemplate.name ??
			"pedidosEnRUTADOS";

		if (templateName === "pedidosEnRUTADOS") {
			if (!Array.isArray(dataClientesRuta)) return [];
			return dataClientesRuta
				.filter((c) => c.tipoMensaje === "pedidosEnRUTADOS")
				.map((c) => c.phoneNumber)
				.filter(Boolean);
		}

		// Para otros templates - usar dataMensajes
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

	const buildTemplateVars = (phoneNumber: string): TemplateVars => {
		const messageData = getMessageData(phoneNumber);
		if (!messageData) {
			// Si no hay messageData, buscar en clientData para pedidosEnRUTADOS
			const clientData = getClientData(phoneNumber);
			if (clientData) {
				return {
					"1": clientData.horaInicial ?? "6:00 am",
					"2": clientData.horaFinal ?? "6:30 am",
				};
			}
			return {};
		}

		const nombreCliente = messageData.name || "Cliente";

		switch (messageData.typeMessage) {
			case "pedidos_no_planeados2":
			case "pedidos_retrasados":
			case "bavaria_now_confirmar":
			case "cambio_frecuencia":
				return {
					"1": nombreCliente,
				};

			case "lunes_aplazados":
				return {};

			case "pedidosEnRUTADOS": {
				const clientData = getClientData(phoneNumber);
				return {
					"1": clientData?.horaInicial ?? "6:00 am",
					"2": clientData?.horaFinal ?? "6:30 am",
				};
			}

			default:
				return {};
		}
	};

	const varsToPositionalArray = (
		vars: TemplateVars,
		paramsList?: { name: string }[]
	): string[] => {
		if (!paramsList || paramsList.length === 0) {
			return Object.values(vars);
		}

		return [...paramsList]
			.sort((a, b) => Number(a.name) - Number(b.name))
			.map((p) => vars[p.name] ?? "");
	};

	const buildPayload = (recipient: string): SendMessageRequest => {
		if (!currentTemplate) throw new Error("No hay template seleccionado");

		// 🔑 Obtener el nombre interno (puede ser metaTemplateName o name)
		const internalTemplateName =
			currentTemplate.metaTemplateName ?? currentTemplate.name;
		const templateNameToUse = getWhatsAppTemplateName(internalTemplateName);

		const templateVarsConfig = currentTemplate.variables ?? {};
		const paramsList = Array.isArray((templateVarsConfig as any).params)
			? (templateVarsConfig as any).params
			: [];

		const rawFormat = (templateVarsConfig as any).format;
		const isPositional =
			rawFormat?.toUpperCase?.() === "POSITIONAL" ||
			rawFormat === "positional";

		const resolvedVars =
			Object.keys(variableValues ?? {}).length > 0
				? variableValues
				: buildTemplateVars(recipient);

		const formattedParams = isPositional
			? varsToPositionalArray(resolvedVars, paramsList)
			: Object.values(resolvedVars);

		// Verificar si este template necesita headerParams
		const needsHeaderParams = templatesWithHeaderParams.includes(templateNameToUse);

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
		if (!selectedTemplate) return false;
		if (!dataMensajes && !dataClientesRuta) return false;
		if (recipients.length === 0) return false;

		if (currentTemplate?.variables && Object.keys(variableValues).length > 0) {
			return currentTemplate.variables.params.every(
				(param: any) => (variableValues[param.name] ?? "").trim().length > 0
			);
		}

		return true;
	};

	const getRecipientCount = () => recipients.length;

	return {
		recipients,
		buildPayload,
		canSend,
		getRecipientCount,
	};
};
