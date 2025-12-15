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

export interface Message {
	id: string;
	content: string;
	direction: "inbound" | "outbound";
	status: "pending" | "sent" | "delivered" | "read" | "failed";
	timestamp: string;
	whatsappMessageId: string;
}

export interface MetricsByUserProps {
	selectedConversation: Conversation | null;
	handleSendReply: (conversationId: string, content: string) => void;
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

export interface NotificationUsar {
	id: string;
	whatsappMessageId: string;
	phone: string;
	contactName: string | null;
	messageType: string;
	content: string | null;
	timestamp: string;
	isRead: boolean;
	metadata: any;
}

export interface NotificationItemProps {
	notification: NotificationUsar;
	isSelected: boolean;
	onClick: () => void;
}

export interface NotificationBellProps {
	onSelectNotification?: (notification: NotificationUsar) => void;
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

export const getMessageStatusIcon = (status: string) => {
	switch (status) {
		case "read":
			return "✓✓";
		case "delivered":
			return "✓";
		case "sent":
			return "⏱";
		case "failed":
			return "✕";
		default:
			return "";
	}
};

export const getMessageStatusColor = (status: string, direction: string) => {
	if (direction === "inbound") return "text-muted-foreground";
	switch (status) {
		case "read":
			return "text-blue-600 dark:text-blue-400";
		case "delivered":
			return "text-gray-600 dark:text-gray-400";
		case "sent":
			return "text-gray-500 dark:text-gray-500";
		case "failed":
			return "text-red-600 dark:text-red-400";
		default:
			return "text-muted-foreground";
	}
};

export const getStatusColor = (status: string) => {
	switch (status) {
		case "active":
			return "bg-green-500/10 text-green-600 dark:text-green-400";
		case "contacted":
			return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
		case "inactive":
			return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
		case "new":
			return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
		default:
			return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
	}
};
