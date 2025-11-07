import { Clients } from "@/db/schema/clients";
import { Pedido } from "@/db/schema/pedido";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Clients_Pedido = sqliteTable("Clients_Pedido", {
	id: text("id").primaryKey(),
	cliente: text("cliente").references(() => Clients.id, {
		onUpdate: "set null",
	}),
	pedido: text("pedido").references(() => Pedido.id, {
		onUpdate: "set null",
	}),
});
