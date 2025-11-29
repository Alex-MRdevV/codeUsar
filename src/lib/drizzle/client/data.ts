/*
import { type Database } from "@/db/db";
import { Clients } from "@/db/schema/clients";
import { buildUpdateSet } from "@/utils/utilities";
import { eq, like, sql } from "drizzle-orm";

export const insertClient = (db: Database) =>
	db
		.insert(Clients)
		.values({
			id: sql.placeholder("id"),
			phone: sql.placeholder("phone"),
			document: sql.placeholder("document"),
			name: sql.placeholder("name"),
			cashless: sql.placeholder("cashless"),
		})
		.prepare();

export const getAllClients = (db: Database) => db.select().from(Clients);

export const getClientById = (db: Database) =>
	db
		.select()
		.from(Clients)
		.where(eq(Clients.id, sql.placeholder("id")))
		.prepare();

export const getClientByDocument = (db: Database) =>
	db
		.select()
		.from(Clients)
		.where(eq(Clients.document, sql.placeholder("document")))
		.prepare();

export const updateClient = (
	db: Database,
	phone?: string,
	document?: string,
	name?: string,
	cashless?: "Si" | "No"
) =>
	db
		.update(Clients)
		.set(
			buildUpdateSet({
				phone,
				document,
				name,
				cashless,
			})
		)
		.where(eq(Clients.id, sql.placeholder("id")))
		.prepare();

export const searchClientsByName = (db: Database) =>
	db
		.select()
		.from(Clients)
		.where(like(Clients.name, sql.placeholder("query")))
		.prepare();

export const deleteClient = (db: Database) =>
	db
		.delete(Clients)
		.where(eq(Clients.id, sql.placeholder("id")))
		.prepare();
*/