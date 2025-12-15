import { getTemplates } from "@/utils/services/templates/all";
import type { Template } from "@/utils/types/templates";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export const useSendTemplates = () => {
	const [data, setData] = useState<Template[] | null>(null);
	const [selectedTemplate, setSelectedTemplate] = useState<string>("");
	const [variableValues, setVariableValues] = useState<Record<string, string>>({});
	const [isTemplateMode, setIsTemplateMode] = useState<boolean>(false);

	useEffect(() => {
		async function load() {
			try {
				const templates = await getTemplates();
				setData(templates);
			} catch (err) {
				toast.error("Ocurrió un error imprevisto al obtener las plantillas");
			}
		}
		load();
	}, []);

	const handleVariableChange = (varName: string, value: string) => {
		setVariableValues((prev) => ({ ...prev, [varName]: value }));
	};

	const currentTemplate = useMemo(
		() => data?.find((t) => t.id === selectedTemplate) || null,
		[selectedTemplate] // Solo depende de selectedTemplate, no de data
	);

	const vars = currentTemplate?.variables ?? null;
	const hasVars = Array.isArray(vars?.params) && vars.params.length > 0;

	const handleTemplateChange = (templateId: string) => {
		setSelectedTemplate(templateId);
		setVariableValues({});
		setIsTemplateMode(true);
	};

	const handleNewSend = () => {
		setSelectedTemplate("");
		setVariableValues({});
		setIsTemplateMode(false);
	};

	return {
		currentTemplate,
		selectedTemplate,
		variableValues,
		isTemplateMode,
		setIsTemplateMode,
		handleTemplateChange,
		handleNewSend,
		hasVars,
		data,
		vars,
		setVariableValues,
		setSelectedTemplate,
		handleVariableChange
	};
};
