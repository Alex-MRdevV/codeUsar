import type { Template } from "@/utils/types/templates";

export async function addTemplate(
	template: Template
): Promise<Template | null> {
	try {
		const res = await fetch("/api/meta/addTemplates", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(template),
		});

		if (!res.ok) {
			throw new Error(`Error al guardar template: ${res.status}`);
		}

		const data = (await res.json()) as Template;
		return data;
	} catch (error) {
		console.error("Error en addTemplate:", error);
		return null;
	}
}
