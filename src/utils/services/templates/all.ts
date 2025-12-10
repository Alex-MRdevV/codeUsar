import type { Template } from "@/utils/types/templates";

export async function getTemplates(): Promise<Template[]> {
	try {
		const response = await fetch("/api/template/all", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			throw new Error(`Error ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();
		return data.templates;
	} catch (error) {
		throw error;
	}
}
