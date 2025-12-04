import type { TemplateForMetrics } from "@/utils/types/templates";

export async function getTemplatesForMetrics(): Promise<
	[Error | null, TemplateForMetrics[] | null]
> {
	try {
		const response = await fetch("/api/data/allDataTemplatesForMetrics", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			return [new Error("Error en la respuesta"), null];
		}

		const result = await response.json();
		const data: TemplateForMetrics[] = result.data;

		return [null, data];
	} catch (error) {
		return [error as Error, null];
	}
}
