import { getTemplates } from "@/lib/drizzle/templates";
import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ locals }) => {
	const ACCESS_TOKEN = import.meta.env.WHATSAPP_ACCESS_TOKEN;
	const WABA_ID = import.meta.env.WHATSAPP_WABA_ID;

	if (!WABA_ID || !ACCESS_TOKEN) {
		return res(
			{
				message: "Las variables de entorno no están definidas",
			},
			{
				status: 401,
			}
		);
	}

	try {
		// Obtener templates de la base de datos
		const dbTemplates = await getTemplates.execute();

		// Transformar los templates de la BD al formato deseado
		const templates = dbTemplates.map((template) => {
			const structure: any = {
				body: {
					text: template.bodyText,
				},
			};

			// Agregar header si existe
			if (template.headerType && template.headerText) {
				structure.header = {
					type: template.headerType as "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT",
					text: template.headerText,
				};
			}

			// Agregar footer si existe
			if (template.footerText) {
				structure.footer = {
					text: template.footerText,
				};
			}

			// Agregar buttons si existen
			if (template.buttons) {
				structure.buttons = template.buttons;
			}

			return {
				id: template.id,
				name: template.name,
				metaTemplateName: template.name,
				language: template.language,
				structure,
				variables: template.variables || undefined,
			};
		});

		return res(
			{
				templates,
				count: templates.length,
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		return res(
			{
				message: "Error al obtener los templates de la base de datos",
				error: error instanceof Error ? error.message : "Error desconocido",
			},
			{
				status: 500,
			}
		);
	}
};
