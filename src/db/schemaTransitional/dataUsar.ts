import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const consolidated_clients = sqliteTable("consolidated_clients", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	phoneNumber: text("phoneNumber").notNull(),
	clienteId: text("clienteId").notNull(),
	nameEstablecimiento: text("nameEstablecimiento"),
	horaInicial: text("horaInicial"),
	horaFinal: text("horaFinal"),
	status: text("status").notNull(), // 'enRuta' | 'segundoViaje' | 'aplazado'
});

export const clientsMensajes = sqliteTable("clientsMensajes", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	nombre: text("nombre"),
	phoneNumber: text("phoneNumber").notNull(),
	tipoMensaje: text("tipoMensaje"),
});
