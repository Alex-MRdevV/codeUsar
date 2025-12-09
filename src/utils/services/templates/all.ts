import type { Template } from "@/utils/types/templates";

export async function getTemplates(): Promise<
	[Error | null, Template[] | null]
> {
	try {
		const response = await fetch("/api/template/all", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		const data: Template[] = await response.json();

		if (!response.ok) {
			return [new Error(), null];
		}
		return [null, data];
	} catch (error) {
		return [error as Error, null];
	}
}
