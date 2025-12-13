import type { SendMessageRequest } from "@/utils/types/providers/meta";
import type { TemplateVars, UseSendMessagesLogicProps } from "@/utils/types/send";
import { useMemo } from "react";

export const useMessagesLogicTemplates = ({
	currentTemplate,
	dataClientesRuta,
	dataMensajes,
	selectedTemplate,
	variableValues,
}: UseSendMessagesLogicProps) => {
	// Recipients filtrados por plantilla
	const recipients = useMemo(() => {
		if (!currentTemplate) return [];

		const templateName =
			currentTemplate.metaTemplateName ??
			currentTemplate.name ??
			"pedidosEnRUTADOS";

		if (templateName === "") {
			if (!Array.isArray(dataClientesRuta)) return [];

			return dataClientesRuta
				.filter((c) => c.tipoMensaje === "pedidosEnRUTADOS")
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

	const buildTemplateVars = (phoneNumber: string): TemplateVars => {
		const messageData = getMessageData(phoneNumber);
		if (!messageData) return {};

		const nombreCliente = messageData.name || "Cliente";

		switch (messageData.typeMessage) {
			case "pedidos_no_planeados":
			case "pedidos_retrasados":
			case "bavaria_now_confirmar":
				return {
					"2": nombreCliente,
				};

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

		const templateNameToUse =
			currentTemplate.metaTemplateName ?? currentTemplate.name;

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

		const needsHeaderParams =
			templateNameToUse === "bavaria_now_confirmar";

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
		if (!dataMensajes) return false;
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
