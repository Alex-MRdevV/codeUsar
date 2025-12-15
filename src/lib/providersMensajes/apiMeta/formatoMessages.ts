import type {
	Component,
	MetaRequest,
	SendMessageRequest,
	TextParameter,
} from "@/utils/types/providers/meta";

export const buildTextMessage = (
	recipient: string,
	content: string
): MetaRequest => {
	const numWithCode = recipient.startsWith("57") ? recipient : `57${recipient}`;
	return {
		messaging_product: "whatsapp",
		recipient_type: "individual",
		to: numWithCode,
		type: "text",
		text: {
			preview_url: false,
			body: content,
		},
	};
};

export const buildTextReplyMessage = (
	recipient: string,
	content: string,
	replyToMessageId: string
): MetaRequest => {
	const numWithCode = recipient.startsWith("57") ? recipient : `57${recipient}`;

	return {
		messaging_product: "whatsapp",
		recipient_type: "individual",
		to: numWithCode,
		type: "text",
		text: {
			preview_url: false,
			body: content,
		},
		context: {
			message_id: replyToMessageId,
		},
	};
};

export const buildTemplateMessage = (
	recipient: string,
	request: SendMessageRequest,
	customParams?: string[] | Record<string, string>
): MetaRequest => {
	const numberWithCode = recipient.startsWith("57")
		? recipient
		: `57${recipient}`;

	const components: Component[] = [];
	const paramFormat = request.parameterFormat || "positional";
	const paramsToUse =
		customParams || request.templateParamsPositional || request.templateParams;

	if (paramsToUse) {
		let parameters: TextParameter[];

		if (Array.isArray(paramsToUse)) {
			// Parámetros posicionales
			parameters = paramsToUse.map((param) => ({
				type: "text",
				text: param,
			}));
		} else {
			// Parámetros con nombre o como objeto
			if (paramFormat === "named") {
				parameters = Object.entries(paramsToUse).map(
					([paramName, paramValue]) => ({
						type: "text",
						parameter_name: paramName,
						text: paramValue,
					})
				);
			} else {
				parameters = Object.values(paramsToUse).map((param) => ({
					type: "text",
					text: param,
				}));
			}
		}

		// Separar parámetros por componente
		if (parameters.length > 0) {
			// HEADER component (si hay headerParams)
			if (request.headerParams) {
				const headerParams = Array.isArray(request.headerParams)
					? request.headerParams.map((param) => ({
							type: "text" as const,
							text: param,
					  }))
					: Object.values(request.headerParams).map((param) => ({
							type: "text" as const,
							text: param,
					  }));

				if (headerParams.length > 0) {
					components.push({
						type: "header",
						parameters: headerParams,
					});
				}
			}

			// BODY component (parámetros restantes o todos si no hay headerParams)
			const bodyParams = request.headerParams
				? parameters.slice(
						Array.isArray(request.headerParams)
							? request.headerParams.length
							: Object.keys(request.headerParams).length
				  )
				: parameters;

			if (bodyParams.length > 0) {
				components.push({
					type: "body",
					parameters: bodyParams,
				});
			}
		}
	}

	// BUTTONS component (si hay URL dinámica)
	if (request.buttonParams) {
		const buttonParameters = Array.isArray(request.buttonParams)
			? request.buttonParams.map((param) => ({
					type: "text" as const,
					text: String(param),
			  }))
			: Object.values(request.buttonParams).map((param) => ({
					type: "text" as const,
					text: String(param),
			  }));

		if (buttonParameters.length > 0) {
			components.push({
				type: "button",
				sub_type: "url",
				index: "0",
				parameters: buttonParameters,
			});
		}
	}

	return {
		messaging_product: "whatsapp",
		recipient_type: "individual",
		to: numberWithCode,
		type: "template",
		template: {
			name: request.templateName!,
			language: {
				code: request.templateLanguage || "es",
			},
			...(components.length > 0 && { components }),
		},
	};
};
