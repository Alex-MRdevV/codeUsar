import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Pedido = sqliteTable(
	"Pedido",
	{
		id: text("id").primaryKey(),
		nombre: text("nombre").notNull(),
		cantidadCajas: integer("cantidadCajas").notNull(),
		estado: text("estado", {
			enum: ["Por entregar", "Entregado", "Rechazado"],
		}).default("Por entregar"),
	},
	(table) => [index("estado_pedido_idx").on(table.estado)]
);
