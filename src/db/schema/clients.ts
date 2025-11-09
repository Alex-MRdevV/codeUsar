import { sql } from "drizzle-orm";
import { check, index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const Clients = sqliteTable(
	"Cliente",
	{
		id: text("id").primaryKey(),
		numeroCliente: text("numeroCliente").notNull(),
		nombre: text("primerNombre").notNull(),
		telefono: text("telefono").notNull(),
		documento: text("documento").notNull(),
		estado: text("estado", { enum: ["activo", "retirado"] }).default("activo"),
	},
	(table) => [
		index("estado_cliente_idx").on(table.estado),
		check("telefono_length_check", sql`LENGTH(${table.telefono}) = 10`),
		check(
			"documento_length_check",
			sql`LENGTH(${table.documento}) BETWEEN 7 AND 10`
		),
	]
);
