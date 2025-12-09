import { getTargetStatusForTemplate, type clientsInRuta, type dataUsar } from "@/utils/types/messages";
import type { SendMessageRequest } from "@/utils/types/providers/meta";
import type { Template } from "@/utils/types/templates";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { SendViewComponent } from "./sendViewComponent";

export interface ViewLogicComponentProps {
	data: Template[]
	dataMensajes: dataUsar[]
	dataClientesRuta: clientsInRuta[]
	selectedTemplate: string
	variableValues: Record<string, string>
	setSelectedTemplate: Dispatch<SetStateAction<string>>
	setVariableValues: Dispatch<SetStateAction<Record<string, string>>>
}

export const SendLogic = ({ data, dataClientesRuta, dataMensajes, selectedTemplate, variableValues, setSelectedTemplate, setVariableValues }:
	ViewLogicComponentProps) => {
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const currentTemplate = useMemo(
		() => data.find((t) => t.id === selectedTemplate) || null,
		[data, selectedTemplate]
	);

	// Variables de la plantilla
	const vars = currentTemplate?.variables ?? null;
	const hasVars = Array.isArray(vars?.params) && vars.params.length > 0;

	const handleCreateTemplate = async (newTemplate: Template) => {
		setSelectedTemplate((prev) => [...prev, newTemplate]);
		setShowCreateModal(false);
	};

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

			case "pedidos_in_ruta":
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

		if (templateName === "pedidos_in_ruta") {
			const clientData = getClientData(phoneNumber);
			return [
				clientData?.horaInicial ?? "6:00 am",
				clientData?.horaFinal ?? "6:30 am",
			];
		}

		// Para las demás plantillas, usar dataMensajes
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

	const recipients = useMemo(() => {
		if (!currentTemplate) return [];

		const templateName =
			currentTemplate.metaTemplateName ??
			currentTemplate.name ??
			"";

		if (templateName === "pedidos_in_ruta") {
			if (!Array.isArray(dataClientesRuta)) return [];

			return dataClientesRuta
				.filter((c) => c.tipoMensaje === "pedidos_in_ruta")
				.map((c) => c.phoneNumber)
				.filter(Boolean);
		}

		// 🔥 Para TODAS las otras plantillas, usar dataMensajes
		if (!Array.isArray(dataMensajes)) return [];

		return dataMensajes
			.filter((msg) => msg.typeMessage === templateName)
			.map((msg) => msg.phone)
			.filter(Boolean);
	}, [dataMensajes, dataClientesRuta, currentTemplate]);

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

	const getRecipientCount = () => recipients.length;

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

	return (
		<SendViewComponent
			canSend={canSend}
			currentTemplate={currentTemplate}
			dataClientesRuta={dataClientesRuta}
			dataMensajes={dataMensajes}
			getRecipientCount={getRecipientCount}
			getTargetStatusForTemplate={getTargetStatusForTemplate}
			handleCreateTemplate={handleCreateTemplate}
			handleNewSend={ }
			handleSendMessage={ }
			handleTemplateChange={ }
			hasVars={hasVars}
			isSubmitting={isSubmitting}
			recipients={recipients}
			resultados={ }
			selectedTemplate={selectedTemplate}
			setVariableValues={setVariableValues}
			setShowCreateModal={setShowCreateModal}
			showCreateModal={showCreateModal}
			templates={data}
			variableValues={variableValues}
			vars={vars}
		/>
	)
}
