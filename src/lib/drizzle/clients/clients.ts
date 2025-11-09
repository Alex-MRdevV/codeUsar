import { Clients } from "@/db/schema/clients";
import type { Database } from "@/utils/db";
import { eq, sql } from "drizzle-orm";

// Crear cliente
export const createClient = (db: Database) => db
  .insert(Clients)
  .values({
    id: sql.placeholder('id'),
    numeroCliente: sql.placeholder('numeroCliente'),
    nombre: sql.placeholder('nombre'),
    telefono: sql.placeholder('telefono'),
    documento: sql.placeholder('documento'),
    estado: sql.placeholder('estado'),
  })
  .prepare();

// Actualizar cliente
export const updateClient = (db: Database, cliente: {
	numeroCliente: string
	nombre: string
	telefono: string
	documento: string
}) => db
  .update(Clients)
  .set({
    numeroCliente: cliente.numeroCliente,
    nombre: cliente.nombre,
    telefono: cliente.telefono,
    documento: cliente.documento,
  })
  .where(eq(Clients.id, sql.placeholder('id')))
  .prepare();

// Obtener clientes activos
export const getActiveClients = (db: Database) => db
  .select()
  .from(Clients)
  .where(eq(Clients.estado, 'activo'))
  .prepare();
