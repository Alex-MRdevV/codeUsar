import { PreviewCard } from "@/components/messages/editor/previewCard";
import { replaceVariables, type PreviewCardContainerProps } from "@/utils/types/templates";
import { useState } from "react";

export const PreviewCardContainer = ({
	template,
	variableValues = {},
	recipients
}: PreviewCardContainerProps) => {
	const { structure, variables } = template;
	const [showExamples, setShowExamples] = useState(false);

	const getVariablesByComponent = (component: 'header' | 'body' | 'footer') => {
		return variables?.params.filter(p => p.component === component) || [];
	};

	// Procesar texto con variables
	const processText = (text: string, component: 'header' | 'body' | 'footer') => {
		const componentVars = {
			format: variables?.format || 'positional',
			params: getVariablesByComponent(component)
		};

		if (componentVars.params.length === 0) return text;
		return replaceVariables(text, componentVars, variableValues, showExamples);
	};

	// Calcular caracteres totales
	const getTotalCharacters = () => {
		let total = 0;
		if (structure?.header?.text) {
			total += processText(structure.header.text, 'header').length;
		}
		if (structure?.body.text) {
			total += processText(structure.body.text, 'body').length;
		}
		if (structure?.footer?.text) {
			total += processText(structure?.footer.text, 'footer').length;
		}
		return total;
	};

	return (
		<PreviewCard
			processText={processText}
			setShowExamples={setShowExamples}
			getTotalCharacters={getTotalCharacters}
			showExamples={showExamples}
			recipients={recipients}
			template={template}
		/>
	)
}
