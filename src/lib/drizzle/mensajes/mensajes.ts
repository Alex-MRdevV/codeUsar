import { Messages } from "@/db/schema/messages";
import type { Database } from "@/utils/db";
import { eq, sql } from "drizzle-orm";

// Crear mensaje
export const createMessage = (db: Database) => db
	.insert(Messages)
	.values({
		id: sql.placeholder("id"),
		userId: sql.placeholder("userId"),
		templateId: sql.placeholder("templateId"),
		clientId: sql.placeholder("clientId"),
		status: sql.placeholder("status"),
		sentAt: sql.placeholder("sentAt"),
		readAt: sql.placeholder("readAt"),
	})
	.prepare();

// Actualizar mensaje
export const updateMessage = (
	db: Database,
	idMensaje: string,
	men: {
		status: "enviado" | "entregado" | "leido" | "fallido";
		readAt: Date;
	}
) =>
	db
		.update(Messages)
		.set({
			status: men.status,
			readAt: men.readAt,
		})
		.where(eq(Messages.id, idMensaje))
		.prepare();

// Obtener mensajes por usuario
export const getMessagesByUser = (db: Database) =>
	db
		.select()
		.from(Messages)
		.where(eq(Messages.userId, sql.placeholder("userId")))
		.prepare();
