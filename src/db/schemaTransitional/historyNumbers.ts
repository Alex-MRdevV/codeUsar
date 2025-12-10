import { Clients } from "@/db/schemaTransitional/clients";
import { Templates } from "@/db/schemaTransitional/templates";
import { sql } from "drizzle-orm";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const MessageHistory = sqliteTable(
	"MessageHistory",
	{
		id: text("id").primaryKey(),
		clientId: text("clientId").references(() => Clients.id, {
			onDelete: "cascade",
		}),
		// Referencia a plantilla (solo si es mensaje template)
		templateId: text("templateId").references(() => Templates.id, {
			onDelete: "set null",
		}),
		// ✨ MEJORA: Dirección explícita del mensaje
		direction: text("direction", {
			enum: ["inbound", "outbound"],
		}).notNull(),
		// Tipo y dirección
		messageType: text("messageType", {
			enum: [
				"template", // Plantilla de WhatsApp
				"text", // Mensaje de texto libre
				"media", // Imagen/video/documento
				"response_received", // Cliente te respondió
			],
		}).notNull(),
		// ✨ MEJORA: ID único de WhatsApp para tracking
		whatsappMessageId: text("whatsappMessageId").unique(),
		// Contenido
		phone: text("phone").notNull(),
		content: text("content"), // Texto del mensaje
		mediaUrl: text("mediaUrl"), // URL si es media
		mediaType: text("mediaType", {
			enum: ["image", "video", "document", "audio"],
		}),
		// Estado (solo para outbound)
		status: text("status", {
			enum: ["pending", "sent", "delivered", "read", "failed"],
		}),
		failureReason: text("failureReason"),
		// ✨ MEJORA: Ventana de conversación de WhatsApp (24 horas)
		conversationWindowExpiry: text("conversationWindowExpiry"), // ISO timestamp
		// Contexto de negocio
		messageContext: text("messageContext", {
			enum: [
				"mass_invitation", // Envío masivo inicial
				"follow_up", // Seguimiento personalizado
				"onboarding", // Acompañamiento para usar app
				"support", // Soporte técnico
			],
		}),
		// Metadata adicional
		metadata: text("metadata", { mode: "json" }).$type<{
			templateVariables?: Record<string, string>;
			responseToMessageId?: string; // Si es respuesta a un mensaje anterior
			automated?: boolean; // Si fue automático o manual
		}>(),
		timestamp: text("timestamp").default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => [
		index("idx_message_client").on(table.clientId),
		index("idx_message_context").on(table.messageContext),
		index("idx_message_timestamp").on(table.timestamp),
		index("idx_conversation_thread").on(table.clientId, table.timestamp),
		index("idx_whatsapp_message_id").on(table.whatsappMessageId),
		index("idx_message_direction").on(table.direction),
	]
);
