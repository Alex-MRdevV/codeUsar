import { Client } from "@/db/schema/client";
import {
	decimal,
	index,
	mysqlEnum,
	mysqlTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const Orders = mysqlTable(
	"Orders",
	{
		id: varchar("id", { length: 191 }).primaryKey(),
		clientId: varchar("contact_id", { length: 191 }).references(
			() => Client.id,
			{ onDelete: "set null" }
		),
		orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
		totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
		status: mysqlEnum("status", [
			"Rechazado",
			"Confirmado",
			"Pendiente",
			"Aplazado",
		]).default("Pendiente"),
		// 🔥 Nuevo enum para códigos de rechazo
		rejectionCode: mysqlEnum("rejection_code", [
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
		]),
		orderDate: timestamp("order_date").notNull(),
		deliveryDate: timestamp("delivery_date"),
		notes: text("notes"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
	},
	(table) => [
		index("idx_order_status").on(table.status),
		index("idx_order_date").on(table.orderDate),
		index("idx_order_number").on(table.orderNumber),
		// 🔥 CHECK para validar coherencia
		sql`CHECK (
      (status = 'Rechazado' AND rejection_code IS NOT NULL)
      OR
      (status <> 'Rechazado' AND rejection_code IS NULL)
    )`,
	]
);
