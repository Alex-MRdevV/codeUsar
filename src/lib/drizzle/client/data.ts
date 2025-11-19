import { db } from "@/db/db";
import { Client } from "@/db/schema/client";
import { buildUpdateSet } from "@/utils/updateUtilities";
import { eq, like, sql } from "drizzle-orm";

export const insertClient = db
	.insert(Client)
	.values({
		id: sql.placeholder("id"),
		phone: sql.placeholder("phone"),
		document: sql.placeholder("document"),
		name: sql.placeholder("name"),
		cashless: sql.placeholder("cashless"),
	})
	.prepare();

export const getAllClients = db.select().from(Client);

export const getClientById = db
	.select()
	.from(Client)
	.where(eq(Client.id, sql.placeholder("id")))
	.prepare();

export const getClientByDocument = db
	.select()
	.from(Client)
	.where(eq(Client.document, sql.placeholder("document")))
	.prepare();

export const updateClient = (
	phone?: string,
	document?: string,
	name?: string,
	cashless?: "Si" | "No"
) =>
	db
		.update(Client)
		.set(
			buildUpdateSet({
				phone,
				document,
				name,
				cashless,
			})
		)
		.where(eq(Client.id, sql.placeholder("id")))
		.prepare();

export const searchClientsByName = db
	.select()
	.from(Client)
	.where(like(Client.name, sql.placeholder("query")))
	.prepare();

export const deleteClient = db
	.delete(Client)
	.where(eq(Client.id, sql.placeholder("id")))
	.prepare();
