import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { Orders } from "./order";

export const OrdersItems = sqliteTable(
	"OrdersItems",
	{
		id: text("id").primaryKey(),
		orderId: text("orderId").references(() => Orders.id, {
			onDelete: "set null",
		}),
		nameProduct: text("nameProduct").notNull(),
		quantity: integer("quantity"),
		notes: text("notes"),
		createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`),
		updatedAt: text("updatedAt").default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => [
		index("idx_order_nameProduct").on(table.nameProduct),
		index("idx_order_orderId").on(table.orderId),
	]
);
