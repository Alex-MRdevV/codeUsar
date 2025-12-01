import type { MetaTemplatesResponse } from "@/utils/types/providers/templatesData";

export async function getTemplates(): Promise<
	[Error | null, MetaTemplatesResponse | null]
> {
	try {
		const response = await fetch("/api/meta/allTemplates", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		const data: MetaTemplatesResponse = await response.json();

		if (!response.ok) {
			return [new Error(), null];
		}
		return [null, data];
	} catch (error) {
		return [error as Error, null];
	}
}
