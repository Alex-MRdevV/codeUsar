import { Clients } from "@/db/schema/clients";
import { sql } from "drizzle-orm";
import {
	date,
	index,
	mysqlEnum,
	mysqlTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";

export const Orders = mysqlTable(
	"Orders",
	{
		id: varchar("id", { length: 100 }).primaryKey(),
		clientId: varchar("clientId", { length: 100 }).references(
			() => Clients.id,
			{ onDelete: "set null" }
		),
		orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
		status: mysqlEnum("status", [
			"Rechazado",
			"Confirmado",
			"Pendiente",
			"Aplazado",
		]).default("Pendiente"),
		rejectionCode: mysqlEnum("rejectionCode", [
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
		orderDate: date("orderDate").notNull(),
		notes: text("notes"),
		createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
		updatedAt: timestamp("updatedAt")
			.default(sql`CURRENT_TIMESTAMP`)
			.onUpdateNow(),
	},
	(table) => [
		index("idx_order_status").on(table.status),
		index("idx_order_date").on(table.orderDate),
		index("idx_order_number").on(table.orderNumber),
		sql`CHECK (
      (status = 'Rechazado' AND rejection_code IS NOT NULL)
      OR
      (status <> 'Rechazado' AND rejection_code IS NULL)
    )`,
	]
);
