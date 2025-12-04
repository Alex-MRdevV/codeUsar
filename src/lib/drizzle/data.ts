import { db } from "@/db/db";
import {
	clientesEnRuta,
	clientsMensajes,
} from "@/db/schemaTransitional/dataUsar";

export async function addClienteEnRuta(data: {
	nameEstablecimiento: string;
	phoneNumber: string;
	horaInicial?: string | null;
	horaFinal?: string | null;
	tipoMensaje: string
}) {
	return await db.insert(clientesEnRuta).values(data);
}

export async function getAllClientesByRuta() {
	return await db.select().from(clientesEnRuta);
}

export const cleanTablaByRutas = db.delete(clientesEnRuta);

export async function addClientMensajes(data: {
	nombre: string;
	phoneNumber: string;
	tipoMensaje: string;
}) {
	return await db.insert(clientsMensajes).values(data).returning();
}

export async function allClientMensajes() {
	return await db
		.select({
			nombre: clientsMensajes.nombre,
			phoneNumber: clientsMensajes.phoneNumber,
			mensaje: clientsMensajes.tipoMensaje,
		})
		.from(clientsMensajes);
}

export const cleanTablaMensajes = db.delete(clientesEnRuta);
