import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const clientsMensajes = sqliteTable("clientsMensajes", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	nombre: text("nombre"),
	phoneNumber: text("phoneNumber").notNull(),
	tipoMensaje: text("tipoMensaje"),
});

export const clientesEnRuta = sqliteTable("clientesEnRuta", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	phoneNumber: text("phoneNumber").notNull(),
	horaInicial: text("horaInicial"),
	horaFinal: text("horaFinal"),
	tipoMensaje: text("tipoMensaje"),
});

