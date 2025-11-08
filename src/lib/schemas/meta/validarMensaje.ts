import z from "zod";

const ImageParameterSchema = z.object({
	type: z.literal("image"),
	image: z.object({
		link: z.string().url(),
	}),
});

const TextParameterSchema = z.object({
	type: z.literal("text"),
	text: z.string(),
});

const CurrencyParameterSchema = z.object({
	type: z.literal("currency"),
	currency: z.object({
		fallback_value: z.string(),
		code: z.string(),
		amount_1000: z.number(),
	}),
});

const DateTimeParameterSchema = z.object({
	type: z.literal("date_time"),
	date_time: z.object({
		fallback_value: z.string(),
	}),
});

const PayloadParameterSchema = z.object({
	type: z.literal("payload"),
	payload: z.string(),
});

// Esquema unificado para parámetros
const ParameterSchema = z.discriminatedUnion("type", [
	ImageParameterSchema,
	TextParameterSchema,
	CurrencyParameterSchema,
	DateTimeParameterSchema,
	PayloadParameterSchema,
]);

// Esquema para Component
const ComponentSchema = z.object({
	type: z.enum(["header", "body", "button"]),
	parameters: z.array(ParameterSchema).optional(),
	sub_type: z.enum(["quick_reply", "url"]).optional(),
	index: z.string().optional(),
});

// Esquema para Language
const LanguageSchema = z.object({
	code: z.string(),
});

const TextSchema = z.object({
	preview_url: z.literal(false),
	body: z.string(),
});

// Esquema para Template
const TemplateSchema = z.object({
	name: z.string(),
	language: LanguageSchema,
	components: z.array(ComponentSchema),
});

export const MetaRequestSchema = z
	.object({
		messaging_product: z.literal("whatsapp"),
		recipient_type: z.literal("individual"),
		to: z.string(),
		type: z.enum(["template", "text"]),
		text: TextSchema.optional(),
		template: TemplateSchema.optional(),
	})
	.refine(
		(data) => {
			// Validar que tenga text o template según el tipo
			if (data.type === "text") {
				return !!data.text && !data.template;
			} else {
				return !!data.template && !data.text;
			}
		},
		{
			message:
				"Debe proporcionar 'text' para tipo texto o 'template' para tipo template",
			path: ["type"],
		}
	);
