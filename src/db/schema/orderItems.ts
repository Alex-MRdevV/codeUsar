import { Orders } from "@/db/schema/order";
import {
	index,
	int,
	mysqlTable,
	text,
	timestamp,
	varchar
} from "drizzle-orm/mysql-core";

export const OrdersItems = mysqlTable(
	"Order_items",
	{
		id: varchar("id", { length: 191 }).primaryKey(),
		orderId: varchar("order_id", { length: 191 }).references(() => Orders.id, {
			onDelete: "set null",
		}),
		name: varchar("name", { length: 191 }).notNull().unique(),
		quantity: int("quantity"),
		notes: text("notes"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
	},
	(table) => [
		index("idx_order_items_name").on(table.name),
	]
);
