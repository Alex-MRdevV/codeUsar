import { Templates } from "@/db/schemaTransitional/templates";
import { sql } from "drizzle-orm";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const MessageHistory = sqliteTable(
	"MessageHistory",
	{
		id: text("id").primaryKey(),
		// Referencia a plantilla (solo si es mensaje template)
		templateId: text("templateId").references(() => Templates.id, {
			onDelete: "set null",
		}),
		direction: text("direction", {
			enum: ["inbound", "outbound"],
		}).notNull(),
		// Tipo de mensaje según WhatsApp API
		messageType: text("messageType", {
			enum: [
				"template",
				"text",
				"image",
				"video",
				"audio",
				"document",
				"location",
				"contacts",
				"sticker",
				"reaction",
				"interactive",
				"button",
			],
		}).notNull(),
		whatsappMessageId: text("whatsappMessageId").unique(),
		phone: text("phone").notNull(),
		contactName: text("contactName"),
		content: text("content"),
		mediaUrl: text("mediaUrl"),
		mediaType: text("mediaType"),
		status: text("status", {
			enum: ["pending", "sent", "delivered", "read", "failed"],
		}),
		failureReason: text("failureReason"),
		// Timestamps importantes para métricas
		sentAt: text("sentAt"), // Cuando se envió
		deliveredAt: text("deliveredAt"), // Cuando se entregó
		readAt: text("readAt"), // Cuando se leyó
		failedAt: text("failedAt"), // Cuando falló
		// Ventana de conversación de WhatsApp (24 horas)
		conversationWindowExpiry: text("conversationWindowExpiry"),
		// Contexto de negocio
		messageContext: text("messageContext", {
			enum: ["follow_up", "onboarding", "support"],
		}),
		// Información de conversación de WhatsApp
		conversationId: text("conversationId"),
		conversationOrigin: text("conversationOrigin", {
			enum: [
				"user_initiated",
				"business_initiated",
				"referral_conversion",
				"authentication",
				"marketing",
				"utility",
				"service",
			],
		}),
		// Metadata adicional
		metadata: text("metadata", { mode: "json" }).$type<{
			templateVariables?: Record<string, string>;
			responseToMessageId?: string;
			automated?: boolean;
			pricing?: {
				billable: boolean;
				category: string;
			};
		}>(),
		timestamp: text("timestamp").default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => [
		index("idx_message_context").on(table.messageContext),
		index("idx_message_timestamp").on(table.timestamp),
		index("idx_whatsapp_message_id").on(table.whatsappMessageId),
		index("idx_message_direction").on(table.direction),
		index("idx_message_status").on(table.status),
		index("idx_phone").on(table.phone),
	]
);
