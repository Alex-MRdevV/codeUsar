import { db } from "@/db/db";
import { MessageHistory } from "@/db/schemaTransitional/historyNumbers";
import type { NotificationUsar } from "@/utils/types/chats";
import { uuid } from "@/utils/uuid";
import { desc, eq, sql } from "drizzle-orm";

export async function getAllConversations() {
	// Obtener todos los números únicos con su información agregada
	const conversations = await db
		.select({
			phoneNumber: MessageHistory.phone,
			name: MessageHistory.contactName,
			lastMessageDate: sql<string>`MAX(${MessageHistory.timestamp})`,
			lastResponseDate: sql<
				string | null
			>`MAX(CASE WHEN ${MessageHistory.direction} = 'inbound' THEN ${MessageHistory.timestamp} END)`,
			totalMessagesSent: sql<number>`COUNT(CASE WHEN ${MessageHistory.direction} = 'outbound' THEN 1 END)`,
			totalMessagesReceived: sql<number>`COUNT(CASE WHEN ${MessageHistory.direction} = 'inbound' THEN 1 END)`,
		})
		.from(MessageHistory)
		.groupBy(MessageHistory.phone, MessageHistory.contactName);

	// Transformar a formato Conversation
	return conversations.map((conv) => {
		const lastMessageDate = new Date(conv.lastMessageDate);
		const daysSinceLastMessage =
			(Date.now() - lastMessageDate.getTime()) / (1000 * 60 * 60 * 24);

		let conversationStatus: "new" | "contacted" | "active" | "inactive";

		if (conv.totalMessagesSent === 0 && conv.totalMessagesReceived === 0) {
			conversationStatus = "new";
		} else if (conv.totalMessagesReceived === 0) {
			conversationStatus = "contacted";
		} else if (daysSinceLastMessage <= 7) {
			conversationStatus = "active";
		} else {
			conversationStatus = "inactive";
		}

		return {
			id: conv.phoneNumber, // Usamos el teléfono como ID único
			phoneNumber: conv.phoneNumber,
			name: conv.name || undefined,
			conversationStatus,
			lastMessageDate: conv.lastMessageDate,
			lastResponseDate: conv.lastResponseDate,
			totalMessagesSent: conv.totalMessagesSent,
			totalMessagesReceived: conv.totalMessagesReceived,
			messages: [], // Se llenarán con getConversationMessages
		};
	});
}

export async function getConversationMessages(phoneNumber: string) {
	const messages = await db
		.select({
			id: MessageHistory.id,
			content: MessageHistory.content,
			direction: MessageHistory.direction,
			status: MessageHistory.status,
			timestamp: MessageHistory.timestamp,
			whatsappMessageId: MessageHistory.whatsappMessageId,
		})
		.from(MessageHistory)
		.where(eq(MessageHistory.phone, phoneNumber))
		.orderBy(desc(MessageHistory.timestamp));

	return messages.map((msg) => ({
		id: msg.id,
		content: msg.content || "",
		direction: msg.direction as "inbound" | "outbound",
		status: msg.status as "pending" | "sent" | "delivered" | "read" | "failed",
		timestamp: msg.timestamp || "",
		whatsappMessageId: msg.whatsappMessageId || "",
	}));
}

export async function insertMessageFromWebhook(webhookData: any) {
	const entry = webhookData.entry[0];
	const change = entry.changes[0];
	const value = change.value;

	// Procesar mensajes entrantes
	if (value.messages && value.messages.length > 0) {
		const message = value.messages[0];

		await db.insert(MessageHistory).values({
			id: uuid.uuid,
			whatsappMessageId: message.id,
			phone: message.from,
			contactName: value.contacts?.[0]?.profile?.name,
			direction: "inbound",
			messageType: message.type,
			content: message.text?.body || message.caption || null,
			mediaUrl:
				message.image?.id ||
				message.video?.id ||
				message.document?.id ||
				message.audio?.id ||
				null,
			mediaType:
				message.type === "image" ||
				message.type === "video" ||
				message.type === "document" ||
				message.type === "audio"
					? message.type
					: null,
			status: "delivered",
			timestamp: new Date(parseInt(message.timestamp) * 1000).toISOString(),
			metadata: {
				responseToMessageId: message.context?.id,
			},
		});
	}

	// Procesar cambios de estado
	if (value.statuses && value.statuses.length > 0) {
		const status = value.statuses[0];

		const updateData: any = {
			status: status.status,
		};

		if (status.status === "sent") {
			updateData.sentAt = new Date(
				parseInt(status.timestamp) * 1000
			).toISOString();
		} else if (status.status === "delivered") {
			updateData.deliveredAt = new Date(
				parseInt(status.timestamp) * 1000
			).toISOString();
		} else if (status.status === "read") {
			updateData.readAt = new Date(
				parseInt(status.timestamp) * 1000
			).toISOString();
		} else if (status.status === "failed") {
			updateData.failedAt = new Date(
				parseInt(status.timestamp) * 1000
			).toISOString();
			updateData.failureReason = status.errors?.[0]?.title;
		}

		// Actualizar metadata con información de pricing
		if (status.pricing) {
			updateData.metadata = sql`json_set(
        COALESCE(${MessageHistory.metadata}, '{}'),
        '$.pricing',
        json(${JSON.stringify(status.pricing)})
      )`;
		}

		await db
			.update(MessageHistory)
			.set(updateData)
			.where(eq(MessageHistory.whatsappMessageId, status.id));
	}
}

export async function insertOutboundMessage(data: {
	phone: string;
	content: string;
	messageType: "text" | "template";
	templateId?: string;
	whatsappMessageId?: string;
	conversationContext?: string;
}) {
	await db.insert(MessageHistory).values({
		id: uuid.uuid,
		phone: data.phone,
		direction: "outbound",
		messageType: data.messageType,
		content: data.content,
		templateId: data.templateId || null,
		whatsappMessageId: data.whatsappMessageId || null,
		status: "pending",
		messageContext: data.conversationContext as any,
		timestamp: new Date().toISOString(),
	});
}

export async function getRecentNotifications(
	limit = 10
): Promise<NotificationUsar[]> {
	const messages = await db
		.select({
			id: MessageHistory.id,
			whatsappMessageId: MessageHistory.whatsappMessageId,
			phone: MessageHistory.phone,
			contactName: MessageHistory.contactName,
			messageType: MessageHistory.messageType,
			content: MessageHistory.content,
			timestamp: MessageHistory.timestamp,
			metadata: MessageHistory.metadata,
		})
		.from(MessageHistory)
		.where(eq(MessageHistory.direction, "inbound"))
		.orderBy(desc(MessageHistory.timestamp))
		.limit(limit);

	return messages.map((msg) => ({
		id: msg.id,
		whatsappMessageId: msg.whatsappMessageId || "",
		phone: msg.phone,
		contactName: msg.contactName,
		messageType: msg.messageType,
		content: msg.content,
		timestamp: msg.timestamp || "",
		isRead: (msg.metadata as any)?.read || false,
		metadata: msg.metadata,
	}));
}

export async function markNotificationAsRead(id: string): Promise<void> {
	await db
		.update(MessageHistory)
		.set({
			metadata: {
				read: true,
			} as any,
		})
		.where(eq(MessageHistory.id, id));
}
