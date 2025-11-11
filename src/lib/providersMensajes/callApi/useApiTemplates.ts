import type {
	CreateTemplateRequest,
	CreateTemplateResponse,
} from "@/utils/types/templates";

export async function createWhatsAppTemplate(
	templateData: CreateTemplateRequest
): Promise<[Error | null, CreateTemplateResponse | null]> {
	try {
		const response = await fetch("/api/user/addTemplates", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(templateData),
		});

		const data: CreateTemplateResponse = await response.json();

		if (!response.ok) {
			return [new Error(data.message || "Error al crear plantilla"), null];
		}

		return [null, data];
	} catch (error) {
		return [error as Error, null];
	}
}
