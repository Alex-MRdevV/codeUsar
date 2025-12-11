export type ConversationStatus = "new" | "contacted" | "active" | "inactive";
export type MessageDirection = "inbound" | "outbound";
export type MessageType = "template" | "text" | "media" | "response_received";
export type MessageStatus =
	| "pending"
	| "sent"
	| "delivered"
	| "read"
	| "failed";
export type MediaType = "image" | "video" | "document" | "audio";
export type MessageContext =
	| "mass_invitation"
	| "follow_up"
	| "onboarding"
	| "support";

export interface Client {
	id: string;
	phoneNumber: string;
	name: string | null;
	conversationStatus: ConversationStatus;
	firstContactDate: string | null;
	lastMessageDate: string | null;
	lastResponseDate: string | null;
	totalMessagesSent: number;
	totalMessagesReceived: number;
	tags: string[] | null;
	notes: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface Message {
	id: string;
	clientId: string;
	templateId: string | null;
	direction: MessageDirection;
	messageType: MessageType;
	whatsappMessageId: string | null;
	phone: string;
	content: string | null;
	mediaUrl: string | null;
	mediaType: MediaType | null;
	status: MessageStatus | null;
	failureReason: string | null;
	conversationWindowExpiry: string | null;
	messageContext: MessageContext | null;
	metadata: {
		templateVariables?: Record<string, string>;
		responseToMessageId?: string;
		automated?: boolean;
	} | null;
	timestamp: string;
}

export interface WindowStatus {
	isActive: boolean;
	isExpiring: boolean;
	expiresAt: Date | null;
	hoursRemaining: number | null;
}

export interface WindowIndicatorProps {
	windowStatus: WindowStatus;
	className?: string;
	showLabel?: boolean;
}

export interface StatusBadgeProps {
	status: ConversationStatus;
	className?: string;
}

export interface MessageStatusIconProps {
	status: MessageStatus | null;
	className?: string;
}

export interface MessageBubbleProps {
	message: Message;
}

export interface ChatViewProps {
	client: Client | null;
	messages: Message[];
	onSendMessage: (content: string) => void;
	onBack?: () => void;
}

export interface GlobalMetricsProps {
	metrics: {
		totalConversations: number;
		activeConversations: number;
		readRate: string;
		responseRate: string;
		failRate: string;
		totalMessages: number;
	};
}

export interface MessageUsar {
	id: string;
	content: string;
	direction: "inbound" | "outbound";
	status: "pending" | "sent" | "delivered" | "read" | "failed";
	timestamp: string;
	whatsappMessageId: string;
}

export interface Conversation {
	id: string;
	phoneNumber: string;
	name?: string;
	conversationStatus: "new" | "contacted" | "active" | "inactive";
	lastMessageDate: string;
	lastResponseDate: string | null;
	totalMessagesSent: number;
	totalMessagesReceived: number;
	messages: Message[];
}

export interface ConversationsListProps {
	conversations: Conversation[];
	selectedId?: string;
	onSelectConversation: (conversation: Conversation) => void;
}

export interface ConversationDetailProps {
	conversation: Conversation;
	onSendReply: (conversationId: string, content: string) => void;
}

export interface HeaderReplyMessagesProps {
	globalMetrics: {
		totalConversations: number;
		activeConversations: number;
		readRate: string;
		responseRate: string;
		failRate: string;
		totalMessages: number;
	};
}
