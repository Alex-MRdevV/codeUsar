import type { TemplateForMetrics } from "@/utils/types/templates";

export async function getTemplatesForMetrics(): Promise<
	[Error | null, TemplateForMetrics[] | null]
> {
	try {
		const response = await fetch("/api/template/data", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		const data: TemplateForMetrics[] = await response.json();

		if (!response.ok) {
			return [new Error(), null];
		}
		return [null, data];
	} catch (error) {
		return [error as Error, null];
	}
}
