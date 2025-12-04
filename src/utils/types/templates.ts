export interface Template {
	id: string;
	name: string;
	metaTemplateName: string;
	language: string;
	structure: {
		header?: {
			type: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT";
			text?: string;
			example?: string;
		};
		body: {
			text: string;
			example?: string[];
		};
		footer?: {
			text: string;
		};
		buttons?: Array<{
			type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
			text: string;
			url?: string;
			phone_number?: string;
		}>;
	};
	variables?: {
		format: "named" | "positional";
		params: Array<{
			name: string;
			placeholder: string;
			example: string;
			component: "header" | "body" | "footer";
		}>;
	};
}

export interface PreviewCardProps {
	template: Partial<Pick<Template, "structure" | "variables">>;
	variableValues?: Record<string, string>;
	recipients: string[];
}

export const replaceVariables = (
	text: string,
	variables: PreviewCardProps["template"]["variables"],
	values: Record<string, string> = {},
	useExamples: boolean = false
): string => {
	if (!variables || !text) return text;

	let result = text;

	if (variables.format === "named") {
		// Formato con nombre: {{first_name}}, {{order_number}}
		variables.params.forEach((param) => {
			const placeholder = `{{${param.name}}}`;
			const value = useExamples
				? param.example
				: values[param.name] || param.placeholder;
			result = result.replace(new RegExp(placeholder, "g"), value);
		});
	} else {
		// Formato posicional: {{1}}, {{2}}, {{3}}
		variables.params.forEach((param, index) => {
			const placeholder = `{{${index + 1}}}`;
			const value = useExamples
				? param.example
				: values[param.name] || param.placeholder;
			result = result.replace(
				new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g"),
				value
			);
		});
	}

	return result;
};

export interface TemplateSelectorProps {
	value: string;
	onChange: (templateId: string) => void;
	templates: {
		id: string;
		name: string;
	}[];
}

export interface VariableEditorProps {
	variables: {
		format: "named" | "positional";
		params: Array<{
			name: string;
			placeholder: string;
			example: string;
			component: "header" | "body" | "footer";
		}>;
	};
	values: Record<string, string>;
	onChange: (values: Record<string, string>) => void;
}

export interface MetaTemplateComponent {
	type: string;
	format?: string;
	text?: string;
	example?: {
		header_text?: string[];
		body_text?: string[][];
	};
}

export interface MetaTemplateRequest {
	name: string;
	category: string;
	language: string;
	components: MetaTemplateComponent[];
}

export interface CreateTemplateResult {
	status: "success" | "error";
	templateId?: string;
	templateName?: string;
	errorCode?: string | number;
	errorMessage?: string;
}

export interface CreateTemplateRequest {
	name: string;
	icon: string;
	color?: string;
	content: string;
	metaTemplateName: string;
	language: string;
	structure: Template["structure"];
	variables?: Template["variables"];
}

export interface CreateTemplateResponse {
	message: string;
	data?: {
		id: string;
		name: string;
		metaTemplateId: string;
		status: string;
	};
	error?: string;
	errorCode?: string | number;
}

type TemplateStatus = "APPROVED" | "PENDING" | "REJECTED";

export interface TemplateForMetrics {
  id: string;
  name: string;
  icon: string;
  color: string;
  messagesSent: number;
  status: TemplateStatus;
}

