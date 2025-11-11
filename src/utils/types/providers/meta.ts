export interface ApiResponse {
	message: string;
	data?: {
		results: MessageResult[];
		summary: { total: number; success: number; failed: number };
	} | null;
	error?: string;
}

export interface ReplyApiResponse {
	message: string;
	data?: {
		messageId: string;
		recipient: string;
		status: string;
	};
	error?: string;
	errorCode?: number;
}

export interface MessageResult {
	recipient: string;
	messageId?: string;
	status: "success" | "error";
	errorCode?: number;
	errorMessage?: string;
}

export interface SendMessageRequest {
	recipients: string[];
	messageType: "text" | "template";
	content?: string;
	templateName?: string;
	templateLanguage?: string;
	// Cambia esto para soportar ambos formatos
	templateParams?: Record<string, string>; // Para parámetros con nombre
	templateParamsPositional?: string[]; // Para parámetros posicionales (opcional)
	parameterFormat?: "named" | "positional"; // Nuevo: especificar el formato
}

export interface ReplyMessageRequest {
	messageType: "text" | "template";
	replyToMessageId: string; // Obligatorio para replies
	content?: string;
	templateName?: string;
	templateLanguage?: string;
	templateParams?: Record<string, string>;
	templateParamsPositional?: string[];
	parameterFormat?: "positional" | "named";
}

export interface MetaRequest {
	messaging_product: "whatsapp";
	recipient_type: "individual";
	to: string; // PHONE_NUMBER
	type: "template" | "text";
	text?: Text;
	template?: Template;
	context?: {
		message_id: string;
	};
}

export interface Text {
	preview_url: false;
	body: string; //MESSAGE_CONTENT
}

export interface Template {
	name: string; // TEMPLATE_NAME
	language: Language;
	components: Component[];
}

export interface Language {
	code: string; // LANGUAGE_AND_LOCALE_CODE
}

export interface Component {
	type: "header" | "body" | "button";
	parameters?: Parameter[];
	sub_type?: "quick_reply" | "url";
	index?: string; // Index for buttons
}

export type Parameter =
	| ImageParameter
	| TextParameter
	| CurrencyParameter
	| DateTimeParameter
	| PayloadParameter;

export interface ImageParameter {
	type: "image";
	image: {
		link: string; // URL
	};
}

export interface TextParameter {
	type: "text";
	text: string; // TEXT_STRING
}

export interface CurrencyParameter {
	type: "currency";
	currency: {
		fallback_value: string; // VALUE
		code: string; // Currency code (e.g., USD)
		amount_1000: number; // Amount in thousandths
	};
}

export interface DateTimeParameter {
	type: "date_time";
	date_time: {
		fallback_value: string; // MONTH DAY, YEAR
	};
}

export interface PayloadParameter {
	type: "payload";
	payload: string; // PAYLOAD
}
