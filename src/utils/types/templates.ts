export interface Template {
	id: string;
	name: string;
	metaTemplateName: string;
	language: string;
	structure: {
		header?: {
			type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
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
	};
	variables?: {
		format: 'named' | 'positional';
		params: Array<{
			name: string;
			placeholder: string;
			example: string;
			component: 'header' | 'body' | 'footer';
		}>;
	};
}

export interface PreviewCardProps {
	template: {
		structure: {
			header?: {
				type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
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
		};
		variables?: {
			format: 'named' | 'positional';
			params: Array<{
				name: string;
				placeholder: string;
				example: string;
				component: 'header' | 'body' | 'footer';
			}>;
		};
	};
	variableValues?: Record<string, string>; // Valores actuales de las variables
	recipients: string[];
}

export const replaceVariables = (
	text: string,
	variables: PreviewCardProps['template']['variables'],
	values: Record<string, string> = {},
	useExamples: boolean = false
): string => {
	if (!variables || !text) return text;

	let result = text;

	if (variables.format === 'named') {
		// Formato con nombre: {{first_name}}, {{order_number}}
		variables.params.forEach(param => {
			const placeholder = `{{${param.name}}}`;
			const value = useExamples
				? param.example
				: (values[param.name] || param.placeholder);
			result = result.replace(new RegExp(placeholder, 'g'), value);
		});
	} else {
		// Formato posicional: {{1}}, {{2}}, {{3}}
		variables.params.forEach((param, index) => {
			const placeholder = `{{${index + 1}}}`;
			const value = useExamples
				? param.example
				: (values[param.name] || param.placeholder);
			result = result.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
		});
	}

	return result;
};

export interface TemplateSelectorProps {
	value: string;
	onChange: (templateId: string) => void;
	templates: {
		id: string
		name: string
	}[]
}

export interface VariableEditorProps {
	variables: {
		format: 'named' | 'positional';
		params: Array<{
			name: string;
			placeholder: string;
			example: string;
			component: 'header' | 'body' | 'footer';
		}>;
	};
	values: Record<string, string>;
	onChange: (values: Record<string, string>) => void;
}
