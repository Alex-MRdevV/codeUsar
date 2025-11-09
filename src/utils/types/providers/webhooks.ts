//lógica de negocio
export interface WebhookEvent {
	id: string;
	type: MessageStatus;
	recipient: {
		name: string;
		phone: string;
	};
	timestamp: Date;
	message: string;
	error?: string;
	metadata?: Record<string, any>;
}

export interface MessageHistoryProps {
	events: WebhookEvent[];
	messageId: string;
}

export type MessageStatus =
	| "sent"
	| "delivered"
	| "read"
	| "failed"
	| "pending"
	| "customer_action"
	| "customer_updated"
	| "price_info";

export type typeEvents = {
	customer_action: string;
	customer_updated: string;
	price_info: string;
	failed: string;
};

export interface MessageStatusBadgeProps {
	status: MessageStatus;
	timestamp: Date;
}

//tipar respuesta de la api
export interface WhatsAppWebhook {
	object: "whatsapp_business_account";
	entry: Entry[];
}

export interface Entry {
	id: string; // WhatsApp Business Account ID
	changes: Change[];
}

export interface Change {
	field: string; // "messages"
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
}

export interface Contact {
	profile: {
		name: string;
	};
	wa_id: string; // WhatsApp ID (phone number)
}

export interface Message {
	from: string; // sender phone number
	id: string; // message ID
	timestamp: string; // as provided by WhatsApp (convert later to Date)
	type: "text" | "image" | "audio" | "video" | "document" | string;
	text?: {
		body: string;
	};
	// puedes añadir más tipos según necesites
}
