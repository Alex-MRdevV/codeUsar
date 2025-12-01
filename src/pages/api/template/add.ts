import { createTemplate } from "@/lib/drizzle/templates";
import { crearPlantillaIndividual } from "@/lib/providersMensajes/apiMeta/addTemplate";
import { res } from "@/utils/responseAstro";
import type { CreateTemplateRequest, Template } from "@/utils/types/templates";
import { uuid } from "@/utils/uuid";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, locals }) => {
	const { env } = locals.runtime;
	const WABA_ID = env.WHATSAPP_WABA_ID;
	const ACCESS_TOKEN = env.WHATSAPP_ACCESS_TOKEN;

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

	let jsonData: CreateTemplateRequest;

	try {
		jsonData = await request.json();
	} catch (error) {
		return res(
			{
				message: "JSON inválido en la solicitud",
			},
			{
				status: 400,
			}
		);
	}

	// Validar campos requeridos
	if (!jsonData.name || !jsonData.metaTemplateName) {
		return res(
			{
				message: "name y metaTemplateName son requeridos",
			},
			{
				status: 400,
			}
		);
	}

	if (
		!jsonData.structure ||
		!jsonData.structure.body ||
		!jsonData.structure.body.text
	) {
		return res(
			{
				message: "structure.body.text es requerido",
			},
			{
				status: 400,
			}
		);
	}

	if (!jsonData.icon) {
		return res(
			{
				message: "icon es requerido",
			},
			{
				status: 400,
			}
		);
	}

	try {
		const templateId = uuid.uuid;

		// Construir objeto Template para enviar a Meta
		const templateForMeta: Template = {
			id: templateId,
			name: jsonData.name,
			metaTemplateName: jsonData.metaTemplateName,
			language: jsonData.language,
			structure: jsonData.structure,
			variables: jsonData.variables,
		};

		// Crear plantilla en Meta
		const metaResult = await crearPlantillaIndividual(
			templateForMeta,
			ACCESS_TOKEN,
			WABA_ID
		);

		if (metaResult.status === "error") {
			return res(
				{
					message: "Error al crear plantilla en Meta",
					error: metaResult.errorMessage,
					errorCode: metaResult.errorCode,
				},
				{
					status: 400,
				}
			);
		}

		// Extraer información de la estructura para los campos individuales
		const { header, body, footer, buttons } = jsonData.structure;

		// Determinar el tipo de header
		let headerType: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT" | "NONE" = "NONE";
		let headerText: string | undefined;

		if (header) {
			if (header.type === "TEXT") {
				headerType = "TEXT";
				headerText = header.text;
			} else if (header.type === "IMAGE") {
				headerType = "IMAGE";
			} else if (header.type === "VIDEO") {
				headerType = "VIDEO";
			} else if (header.type === "DOCUMENT") {
				headerType = "DOCUMENT";
			}
		}

		// Procesar botones si existen
		let buttonsData = undefined;
		if (buttons && buttons.length > 0) {
			buttonsData = buttons.map((btn) => ({
				type: btn.type,
				text: btn.text,
				...(btn.url && { url: btn.url }),
				...(btn.phone_number && { phoneNumber: btn.phone_number }),
			}));
		}

		// Insertar en la base de datos con la nueva estructura
		await createTemplate.execute({
			id: templateId,
			name: jsonData.name,
			icon: jsonData.icon,
			color: jsonData.color || "#000000",
			metaStatus: "PENDING",
			headerType: headerType,
			headerText: headerText || null,
			bodyText: body.text,
			footerText: footer?.text || null,
			variables: jsonData.variables || null,
			buttons: buttonsData || null,
			usageCount: 0,
		});

		return res(
			{
				message:
					"Plantilla creada exitosamente. Pendiente de aprobación por Meta.",
				data: {
					id: templateId,
					name: jsonData.name,
					metaTemplateId: metaResult.templateId,
					status: "PENDING",
				},
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		return res(
			{
				message: "Error del servidor",
				error: (error as Error).message,
			},
			{
				status: 500,
			}
		);
	}
};
