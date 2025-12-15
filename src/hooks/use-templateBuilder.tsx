import type { UseTemplateMessageBuilderProps } from "@/utils/types/send";
import { useMemo } from "react";

export const useTemplateMessageBuilder = ({
	template,
	variableValues,
}: UseTemplateMessageBuilderProps) => {
	const buildMessage = useMemo(() => {
		return (customValues?: Record<string, string>): string => {
			if (!template) return "";

			const valuesToUse = customValues || variableValues;
			let result = "";

			// HEADER
			if (template.structure.header?.text) {
				result += template.structure.header.text + "\n\n";
			}

			// BODY
			let bodyText = template.structure.body.text;

			if (template.variables) {
				const { format, params } = template.variables;

				if (format === "positional") {
					// Reemplaza {{1}}, {{2}}, etc.
					params.forEach((p, index) => {
						const value = valuesToUse[p.name] || p.example || "";
						bodyText = bodyText.replace(
							new RegExp(`\\{\\{${index + 1}\\}\\}`, "g"),
							value
						);
					});
				}

				if (format === "named") {
					// Reemplaza {{nombre}}, {{codigo}}, etc.
					params.forEach((p) => {
						const value = valuesToUse[p.name] || p.example || "";
						const placeholder = p.placeholder || p.name;
						bodyText = bodyText.replace(
							new RegExp(`\\{\\{${placeholder}\\}\\}`, "g"),
							value
						);
					});
				}
			}

			result += bodyText + "\n";

			// FOOTER
			if (template.structure.footer?.text) {
				result += "\n" + template.structure.footer.text;
			}

			return result.trim();
		};
	}, [template, variableValues]);

	const areVariablesComplete = useMemo(() => {
		if (!template?.variables) return true;

		return template.variables.params.every(
			(param) => (variableValues[param.name] || "").trim().length > 0
		);
	}, [template, variableValues]);

	const missingVariables = useMemo(() => {
		if (!template?.variables) return [];

		return template.variables.params
			.filter((param) => !(variableValues[param.name] || "").trim())
			.map((param) => param.name);
	}, [template, variableValues]);

	const previewMessage = useMemo(() => {
		if (!template) return "";

		const exampleValues: Record<string, string> = {};

		if (template.variables) {
			template.variables.params.forEach((param) => {
				exampleValues[param.name] =
					variableValues[param.name] || param.example || `[${param.name}]`;
			});
		}

		return buildMessage(exampleValues);
	}, [template, variableValues, buildMessage]);

	const variableInfo = useMemo(() => {
		if (!template?.variables) return null;

		return {
			format: template.variables.format,
			count: template.variables.params.length,
			params: template.variables.params.map((p) => ({
				name: p.name,
				placeholder: p.placeholder || p.name,
				example: p.example || "",
				hasValue: !!(variableValues[p.name] || "").trim(),
			})),
		};
	}, [template, variableValues]);

	return {
		buildMessage,
		areVariablesComplete,
		missingVariables,
		previewMessage,
		variableInfo,
	};
};
