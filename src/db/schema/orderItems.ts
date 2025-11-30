import { Orders } from "@/db/schema/order";
import { sql } from "drizzle-orm";
import {
	index,
	int,
	mysqlTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";

export const OrdersItems = mysqlTable(
	"OrdersItems",
	{
		id: varchar("id", { length: 100 }).primaryKey(),
		orderId: varchar("orderId", { length: 100 }).references(() => Orders.id, {
			onDelete: "set null",
		}),
		nameProduct: varchar("nameProduct", { length: 191 }).notNull(),
		quantity: int("quantity"),
		notes: text("notes"),
		createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
		updatedAt: timestamp("updatedAt")
			.default(sql`CURRENT_TIMESTAMP`)
			.onUpdateNow(),
	},
	(table) => [
		index("idx_order_nameProduct").on(table.nameProduct),
		index("idx_order_orderId").on(table.orderId),
	]
);
