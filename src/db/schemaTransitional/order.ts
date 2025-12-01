import { sql } from "drizzle-orm";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { Clients } from "./clients";

export const Orders = sqliteTable(
	"Orders",
	{
		id: text("id").primaryKey(),
		clientId: text("clientId").references(() => Clients.id, {
			onDelete: "set null",
		}),
		orderNumber: text("orderNumber").notNull().unique(),
		status: text("status", {
			enum: ["Rechazado", "Confirmado", "Pendiente", "Aplazado"],
		}).default("Pendiente"),
		rejectionCode: text("rejectionCode", {
			enum: [
				"ZP",
				"Z6",
				"ZR",
				"ZH",
				"ZL",
				"Z4",
				"99",
				"ZS",
				"ZE",
				"Z3",
				"16",
				"10",
				"MC",
				"MT",
			],
		}),
		orderDate: text("orderDate").notNull(), // SQLite usa TEXT para fechas ISO
		notes: text("notes"),
		createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`),
		updatedAt: text("updatedAt").default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => [
		index("idx_order_status").on(table.status),
		index("idx_order_date").on(table.orderDate),
		index("idx_order_number").on(table.orderNumber),
	]
);
