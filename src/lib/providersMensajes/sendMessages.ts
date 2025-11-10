import type {
	Component,
	MetaRequest,
	SendMessageRequest,
	TextParameter,
} from "@/utils/types/providers/meta";

export const buildMetaRequest = (
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

		// Determinar el formato (por defecto "positional" como indica Meta)
		const paramFormat = request.parameterFormat || "positional";

		// Si hay parámetros de plantilla
		if (
			request.templateParams &&
			Object.keys(request.templateParams).length > 0
		) {
			let parameters: TextParameter[];

			if (paramFormat === "named") {
				// Formato con nombre: incluir parameter_name
				parameters = Object.entries(request.templateParams).map(
					([paramName, paramValue]) => ({
						type: "text",
						parameter_name: paramName,
						text: paramValue,
					})
				);
			} else {
				// Formato posicional: mantener el orden, sin parameter_name
				parameters = Object.values(request.templateParams).map((param) => ({
					type: "text",
					text: param,
				}));
			}

			components.push({
				type: "body",
				parameters,
			});
		} else if (
			request.templateParamsPositional &&
			request.templateParamsPositional.length > 0
		) {
			// Soporte alternativo para array directo (siempre posicional)
			const parameters: TextParameter[] = request.templateParamsPositional.map(
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
