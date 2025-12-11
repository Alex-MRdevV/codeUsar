export interface WhatsAppWebhook {
	object: "whatsapp_business_account";
	entry: Entry[];
}

export interface Entry {
	id: string; // WhatsApp Business Account ID
	changes: Change[];
}

export interface Change {
	field: "messages";
	value: WebhookValue;
}

export interface WebhookValue {
	messaging_product: "whatsapp";
	metadata: {
		display_phone_number: string;
		phone_number_id: string;
	};
	contacts?: Contact[];
	messages?: Message[];
	statuses?: Status[];
	errors?: WebhookError[];
}

export interface Contact {
	profile: {
		name: string;
	};
	wa_id: string; // WhatsApp ID (phone number)
}

// ============================================
// MENSAJES ENTRANTES
// ============================================

export interface Message {
	from: string; // sender phone number
	id: string; // message ID
	timestamp: string; // Unix timestamp as string
	type: MessageType;
	text?: TextMessage;
	image?: MediaMessage;
	video?: MediaMessage;
	audio?: AudioMessage;
	document?: DocumentMessage;
	location?: LocationMessage;
	contacts?: ContactMessage[];
	sticker?: StickerMessage;
	reaction?: ReactionMessage;
	interactive?: InteractiveMessage;
	button?: ButtonMessage;
	context?: MessageContext;
}

export type MessageType = 
	| "text" 
	| "image" 
	| "video" 
	| "audio" 
	| "document" 
	| "location" 
	| "contacts" 
	| "sticker" 
	| "reaction" 
	| "interactive" 
	| "button" 
	| "order" 
	| "system";

export interface TextMessage {
	body: string;
}

export interface MediaMessage {
	caption?: string;
	mime_type: string;
	sha256: string;
	id: string;
}

export interface AudioMessage {
	mime_type: string;
	sha256: string;
	id: string;
	voice: boolean;
}

export interface DocumentMessage {
	caption?: string;
	filename: string;
	mime_type: string;
	sha256: string;
	id: string;
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
		last_name?: string;
	};
	phones?: Array<{
		phone: string;
		type?: string;
	}>;
}

export interface StickerMessage {
	mime_type: string;
	sha256: string;
	id: string;
	animated: boolean;
}

export interface ReactionMessage {
	message_id: string;
	emoji: string;
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

export interface ButtonMessage {
	text: string;
	payload: string;
}

export interface MessageContext {
	from: string;
	id: string;
	referred_product?: {
		catalog_id: string;
		product_retailer_id: string;
	};
}

// ============================================
// ESTADOS DE MENSAJES
// ============================================

export interface Status {
	id: string; // message ID
	status: MessageStatus;
	timestamp: string; // Unix timestamp as string
	recipient_id: string; // recipient phone number
	pricing?: Pricing;
	conversation?: Conversation;
	errors?: StatusError[];
}

export type MessageStatus =
	| "sent"
	| "delivered"
	| "read"
	| "failed"
	| "pending";

export interface Pricing {
	billable: boolean;
	pricing_model: string; // "PMP"
	category: "authentication" | "marketing" | "utility" | "service" | "referral_conversion";
	type?: "regular" | "free_tier" | "free_entry_point";
}

export interface Conversation {
	id: string;
	origin: {
		type: "user_initiated" | "business_initiated" | "referral_conversion" | "authentication" | "marketing" | "utility" | "service";
	};
	expiration_timestamp?: string;
}

export interface StatusError {
	code: number;
	title: string;
	message?: string;
	error_data?: {
		details: string;
	};
}

export interface WebhookError {
	code: number;
	title: string;
	message?: string;
	error_data?: {
		details: string;
	};
}

// ============================================
// TIPOS PARA TU APLICACIÓN
// ============================================

export interface WebhookEvent {
	id: string;
	type: MessageStatus | CustomEventType;
	recipient: {
		name: string;
		phone: string;
	};
	timestamp: Date;
	message: string;
	error?: string;
	metadata?: Record<string, any>;
}

export type CustomEventType =
	| "customer_action"
	| "customer_updated"
	| "price_info";

export interface MessageHistoryProps {
	events: WebhookEvent[];
	messageId: string;
}

export interface MessageStatusBadgeProps {
	status: MessageStatus | CustomEventType;
	timestamp: Date;
}
