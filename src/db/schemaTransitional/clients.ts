import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Clients = sqliteTable(
	"Clients",
	{
		id: text("id").primaryKey(),
		phoneNumber: text("phoneNumber").notNull(),
		name: text("name"),
		conversationStatus: text("conversationStatus", {
			enum: [
				"new", // Nunca contactado
				"contacted", // Ya se le envió al menos un mensaje
				"active", // Ha respondido al menos una vez
				"inactive", // No responde hace tiempo
			],
		}).default("new"),
		// ✨ Fechas clave para tracking
		firstContactDate: text("firstContactDate"), // Primer mensaje que le enviaste
		lastMessageDate: text("lastMessageDate"), // Último mensaje (entrante o saliente)
		lastResponseDate: text("lastResponseDate"), // Última vez que ÉL te respondió
		// ✨ Contadores útiles
		totalMessagesSent: integer("totalMessagesSent").default(0), // Mensajes que le enviaste
		totalMessagesReceived: integer("totalMessagesReceived").default(0), // Mensajes que recibiste de él
		// Metadata opcional
		tags: text("tags", { mode: "json" }).$type<string[]>(), // ["priority", "vip", etc]
		notes: text("notes"),
		// Timestamps
		createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`),
		updatedAt: text("updatedAt")
			.default(sql`CURRENT_TIMESTAMP`)
			.$onUpdate(() => sql`CURRENT_TIMESTAMP`),
	},
	(table) => [
		index("idx_client_phone").on(table.phoneNumber),
		index("idx_client_conversation_status").on(table.conversationStatus),
		index("idx_client_last_message").on(table.lastMessageDate), // ✨ Para ordenar por actividad reciente
	]
);
