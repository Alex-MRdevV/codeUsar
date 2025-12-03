import { db } from "@/db/db";
import {
	clientsMensajes,
	consolidated_clients,
} from "@/db/schemaTransitional/dataUsar";

export async function addConsolidatedClient(data: {
	phoneNumber: string;
	clienteId: string;
	nameEstablecimiento?: string | null;
	horaInicial?: string | null;
	horaFinal?: string | null;
	status: "enRuta" | "segundoViaje" | "aplazado";
}) {
	return await db.insert(consolidated_clients).values(data);
}

export async function getAllConsolidatedClients() {
	return await db.select().from(consolidated_clients);
}

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
