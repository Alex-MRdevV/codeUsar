export interface WhatsAppWebhookPayload {
	object: "whatsapp_business_account";
	entry: WebhookEntry[];
}

export interface WebhookEntry {
	id: string; // WHATSAPP_BUSINESS_ACCOUNT_ID
	changes: WebhookChange[];
}

export interface WebhookChange {
	value: WebhookValue;
	field: "messages"; // Siempre será "messages"
}

export interface WebhookValue {
	messaging_product: "whatsapp";
	metadata: WebhookMetadata;
	contacts?: Contact[];
	messages?: IncomingMessage[]; // Mensajes RECIBIDOS
	statuses?: MessageStatus[]; // Estado de mensajes ENVIADOS
	errors?: WhatsAppError[];
}

export interface WebhookMetadata {
	display_phone_number: string;
	phone_number_id: string;
}

export interface IncomingMessage {
	from: string; // Número del usuario que envió el mensaje
	id: string; // ID único del mensaje (wamid.xxx)
	timestamp: string; // Unix timestamp
	type: MessageType;
	context?: MessageContext; // Si es una respuesta a otro mensaje

	// Contenido según el tipo
	text?: TextMessage;
	image?: MediaMessage;
	video?: MediaMessage;
	audio?: MediaMessage;
	document?: MediaMessage;
	sticker?: MediaMessage;
	location?: LocationMessage;
	contacts?: ContactMessage[];
	interactive?: InteractiveMessage;
	button?: ButtonReply;
	reaction?: ReactionMessage;
}

export type MessageType =
	| "text"
	| "image"
	| "video"
	| "audio"
	| "document"
	| "sticker"
	| "location"
	| "contacts"
	| "interactive"
	| "button"
	| "reaction"
	| "unknown";

export interface TextMessage {
	body: string;
}

export interface MediaMessage {
	id: string; // ID del media para descargarlo
	mime_type: string;
	sha256: string;
	caption?: string; // Para imágenes/videos
	filename?: string; // Para documentos
}

export interface LocationMessage {
	latitude: number;
	longitude: number;
	name?: string;
	address?: string;
}

export interface ContactMessage {
	name: {
		formatted_name: string;
		first_name?: string;
	};
	phones?: Array<{
		phone: string;
		type?: string;
	}>;
}

export interface InteractiveMessage {
	type: "button_reply" | "list_reply";
	button_reply?: {
		id: string;
		title: string;
	};
	list_reply?: {
		id: string;
		title: string;
		description?: string;
	};
}

export interface ButtonReply {
	payload: string;
	text: string;
}

export interface ReactionMessage {
	message_id: string;
	emoji: string; // Vacío si removió la reacción
}

export interface MessageContext {
	from: string;
	id: string; // ID del mensaje al que responde
	forwarded?: boolean;
	frequently_forwarded?: boolean;
}

export interface Contact {
	profile: {
		name: string;
	};
	wa_id: string; // WhatsApp ID del contacto
}

export interface MessageStatus {
	id: string; // wamid del mensaje enviado
	status: MessageStatusType;
	timestamp: string;
	recipient_id: string; // Número del destinatario
	conversation?: ConversationInfo;
	pricing?: PricingInfo;
	errors?: WhatsAppError[];
}

export type MessageStatusType =
	| "sent" // Enviado a los servidores de WhatsApp
	| "delivered" // Entregado al dispositivo del usuario
	| "read" // Leído por el usuario (checks azules)
	| "failed"; // Falló el envío

export interface ConversationInfo {
	id: string;
	expiration_timestamp?: string;
	origin: {
		type:
			| "service"
			| "user_initiated"
			| "referral_conversion"
			| "business_initiated";
	};
}

export interface PricingInfo {
	billable: boolean;
	pricing_model: "CBP";
	category: "service" | "utility" | "authentication" | "marketing";
}

export interface WhatsAppError {
	code: number;
	title: string;
	message: string;
	error_data: {
		details: string;
	};
}
