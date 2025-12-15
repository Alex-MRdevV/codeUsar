import type { UseBulkMessageBuilderProps } from "@/utils/types/send";
import { useMemo } from "react";

export const useBulkMessageBuilder = ({
	template,
	recipients,
}: UseBulkMessageBuilderProps) => {

	const messages = useMemo(() => {
		if (!template) return [];

		return recipients.map((recipient) => {
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
					params.forEach((p, index) => {
						const value = recipient.variables[p.name] || p.example || "";
						bodyText = bodyText.replace(
							new RegExp(`\\{\\{${index + 1}\\}\\}`, "g"),
							value
						);
					});
				}

				if (format === "named") {
					params.forEach((p) => {
						const value = recipient.variables[p.name] || p.example || "";
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

			return {
				phone: recipient.phone,
				content: result.trim(),
			};
		});
	}, [template, recipients]);

	return { messages };
};
