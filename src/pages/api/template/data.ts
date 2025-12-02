import { getTemplates, getTemplatesForHistory } from "@/lib/drizzle/templates";
import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ locals }) => {
	try {
		const templates = await getTemplatesForHistory.execute();

		return new Response(JSON.stringify(templates), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Error fetching templates:", error);

		return new Response(
			JSON.stringify({ error: "Failed to fetch templates" }),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}
};
