import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const clientesEnRuta = sqliteTable("consolidated_clients", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	nameEstablecimiento: text("nameEstablecimiento"),
	phoneNumber: text("phoneNumber").notNull(),
	horaInicial: text("horaInicial"),
	horaFinal: text("horaFinal"),
});

export const clientsMensajes = sqliteTable("clientsMensajes", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	nombre: text("nombre"),
	phoneNumber: text("phoneNumber").notNull(),
	tipoMensaje: text("tipoMensaje"),
});
