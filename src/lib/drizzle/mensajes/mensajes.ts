import { Messages } from "@/db/schema/messages";
import { User } from "@/db/schema/users";
import type { Database } from "@/utils/db";
import { and, eq, ne, sql } from "drizzle-orm";

// Crear mensaje
export const createMessage = (db: Database) =>
	db
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
		.select({
			message: Messages,
			user: User,
		})
		.from(Messages)
		.innerJoin(User, eq(Messages.userId, User.id))
		.where(
			and(
				eq(Messages.userId, sql.placeholder("userId")),
				ne(User.estado, "retirado")
			)
		)
		.prepare();
