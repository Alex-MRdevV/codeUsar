import type {
	MetaTemplateComponent,
	MetaTemplateRequest,
	Template,
} from "@/utils/types/templates";

export const buildMetaTemplateRequest = (
	template: Template
): MetaTemplateRequest => {
	const components: MetaTemplateComponent[] = [];

	// Header component
	if (template.structure.header) {
		const headerComponent: MetaTemplateComponent = {
			type: "HEADER",
			format: template.structure.header.type,
		};

		if (template.structure.header.type === "TEXT") {
			headerComponent.text = template.structure.header.text;

			if (template.structure.header.example) {
				headerComponent.example = {
					header_text: [template.structure.header.example],
				};
			}
		}

		components.push(headerComponent);
	}

	// Body component (obligatorio)
	const bodyComponent: MetaTemplateComponent = {
		type: "BODY",
		text: template.structure.body.text,
	};

	if (
		template.structure.body.example &&
		template.structure.body.example.length > 0
	) {
		bodyComponent.example = {
			body_text: [template.structure.body.example],
		};
	}

	components.push(bodyComponent);

	// Footer component
	if (template.structure.footer) {
		components.push({
			type: "FOOTER",
			text: template.structure.footer.text,
		});
	}

	return {
		name: template.metaTemplateName,
		category: "MARKETING", // Puedes ajustar esto según tus necesidades: MARKETING, UTILITY, AUTHENTICATION
		language: template.language,
		components,
	};
};
