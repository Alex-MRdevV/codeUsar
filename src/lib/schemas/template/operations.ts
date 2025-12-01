import * as v from "valibot";

export const createTemplateSchema = v.object({
	id: v.pipe(v.string(), v.minLength(1)),

	// Básicos
	name: v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
	icon: v.pipe(v.string(), v.minLength(1), v.maxLength(50)),
	color: v.optional(v.pipe(v.string(), v.maxLength(20))),

	// Meta Template
	metaTemplateId: v.optional(v.pipe(v.string(), v.maxLength(191))),
	metaStatus: v.picklist(["PENDING", "APPROVED", "REJECTED"]),

	// Header
	headerType: v.picklist(["TEXT", "IMAGE", "VIDEO", "DOCUMENT", "NONE"]),
	headerText: v.optional(v.string()),
	bodyText: v.pipe(v.string(), v.minLength(1)), // NOT NULL
	footerText: v.optional(v.pipe(v.string(), v.maxLength(60))),

	// Variables (JSON)
	variables: v.optional(
		v.object({
			type: v.picklist(["named", "positional"]),
			list: v.array(
				v.object({
					key: v.pipe(v.string(), v.minLength(1)),
					label: v.pipe(v.string(), v.minLength(1)),
					example: v.pipe(v.string(), v.minLength(1)),
				})
			),
		})
	),

	// Buttons (JSON)
	buttons: v.optional(
		v.array(
			v.object({
				type: v.picklist(["QUICK_REPLY", "URL", "PHONE_NUMBER"]),
				text: v.pipe(v.string(), v.minLength(1), v.maxLength(20)),
				url: v.optional(v.pipe(v.string(), v.url())),
				phoneNumber: v.optional(v.pipe(v.string(), v.minLength(1))),
			})
		)
	),

	// Métricas
	usageCount: v.pipe(v.number(), v.minValue(0)),
	createdAt: v.pipe(v.string(), v.isoTimestamp()),
	updatedAt: v.pipe(v.string(), v.isoTimestamp()),
});

export const UpdateTemplateSchema = v.partial(createTemplateSchema, ["id"]);

export type createTemplateInput = v.InferInput<typeof createTemplateSchema>;
export type UpdateTemplateInput = v.InferInput<typeof UpdateTemplateSchema>;
