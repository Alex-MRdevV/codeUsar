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
