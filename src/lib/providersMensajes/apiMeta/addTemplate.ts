import { urlCrearPlantilla } from "@/lib/providersMensajes/metaUrls";
import { buildMetaTemplateRequest } from "@/utils/services/buildTemplates";
import type { CreateTemplateResult, Template } from "@/utils/types/templates";

export const crearPlantillaIndividual = async (
	template: Template,
	accessToken: string,
	wabaId: string
): Promise<CreateTemplateResult> => {
	try {
		const metaRequest = buildMetaTemplateRequest(template);
		const url = urlCrearPlantilla(wabaId);

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(metaRequest),
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				status: "error",
				templateName: template.name,
				errorCode: data.error?.code,
				errorMessage: data.error?.message || "Error desconocido",
			};
		}

		return {
			status: "success",
			templateId: data.id,
			templateName: template.name,
		};
	} catch (error) {
		return {
			status: "error",
			templateName: template.name,
			errorMessage: (error as Error).message,
		};
	}
};
