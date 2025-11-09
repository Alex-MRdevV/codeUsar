import { Clients_Pedido } from "@/db/schema/clientsPedido";
import { Pedido } from "@/db/schema/pedido";
import type { Database } from "@/utils/db";
import { eq, sql } from "drizzle-orm";

// Crear pedido
export const createPedido = (db: Database) =>
	db
		.insert(Pedido)
		.values({
			id: sql.placeholder("id"),
			nombre: sql.placeholder("nombre"),
			cantidadCajas: sql.placeholder("cantidadCajas"),
			estado: sql.placeholder("estado"),
		})
		.prepare();

// Actualizar pedido
export const updatePedido = (
	db: Database,
	pedidoId: string,
	pedido: {
		nombre: string;
		cantidad: number;
		estado: "Por entregar" | "Entregado" | "Rechazado";
	}
) =>
	db
		.update(Pedido)
		.set({
			nombre: pedido.nombre,
			cantidadCajas: pedido.cantidad,
			estado: pedido.estado,
		})
		.where(eq(Pedido.id, pedidoId))
		.prepare();

// Asociar cliente con pedido
export const createClientPedidoRelation = (db: Database) =>
	db
		.insert(Clients_Pedido)
		.values({
			id: sql.placeholder("id"),
			cliente: sql.placeholder("cliente"),
			pedido: sql.placeholder("pedido"),
		})
		.prepare();
