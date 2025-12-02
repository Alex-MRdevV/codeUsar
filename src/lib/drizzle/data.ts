import { db } from "@/db/db";
import {
	bavaria_clients,
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

export async function addBavariaClient(data: {
	clienteId: string;
	nombre?: string | null;
}) {
	return await db.insert(bavaria_clients).values(data).returning();
}

export async function getAllBavariaClients() {
	return await db.select().from(bavaria_clients);
}
