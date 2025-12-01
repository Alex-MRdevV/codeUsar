export interface MetaTemplatesResponse {
	data: MetaTemplate[];
	paging: {
		cursors: {
			before: string;
			after: string;
		};
	};
}

export interface MetaTemplate {
	name: string;
	parameter_format: "POSITIONAL" | "NAMED" | string;
	components: MetaComponent[];
	language: string;
	status: string;
	category: string;
	sub_category?: string;
	id: string;
}

export type MetaComponent =
	| MetaHeaderComponent
	| MetaBodyComponent
	| MetaButtonsComponent
	| MetaFooterComponent;

export interface MetaHeaderComponent {
	type: "HEADER";
	format: "TEXT" | "IMAGE" | string;
	text?: string;
	example?: {
		header_text: string[];
	};
}

export interface MetaBodyComponent {
	type: "BODY";
	text: string;
	example?: {
		body_text: string[][];
	};
}

export interface MetaFooterComponent {
	type: "FOOTER";
	text: string;
}

export interface MetaButtonsComponent {
	type: "BUTTONS";
	buttons: MetaButton[];
}

export interface MetaButton {
	type: "URL" | "PHONE_NUMBER" | "QUICK_REPLY" | string;
	text: string;
	url?: string;
	phone_number?: string;
	payload?: string;
}
