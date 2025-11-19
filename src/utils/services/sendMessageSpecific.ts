import type {
	Component,
	MetaRequest,
	ReplyMessageRequest,
	TextParameter,
} from "@/utils/types/providers/meta";

export const buildMetaReplyRequest = (
	recipient: string,
	request: ReplyMessageRequest
): MetaRequest => {
	const baseRequest: MetaRequest = {
		messaging_product: "whatsapp",
		recipient_type: "individual",
		to: recipient,
		type: request.messageType,
		context: {
			message_id: request.replyToMessageId,
		},
	};

	if (request.messageType === "text" && request.content) {
		baseRequest.text = {
			preview_url: false,
			body: request.content,
		};
	} else if (request.messageType === "template" && request.templateName) {
		const components: Component[] = [];

		const paramFormat = request.parameterFormat || "positional";

		if (
			request.templateParams &&
			Object.keys(request.templateParams).length > 0
		) {
			let parameters: TextParameter[];

			if (paramFormat === "named") {
				parameters = Object.entries(request.templateParams).map(
					([paramName, paramValue]) => ({
						type: "text",
						parameter_name: paramName,
						text: paramValue,
					})
				);
			} else {
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
