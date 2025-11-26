/*
import { db } from "@/db/db";
import { Orders } from "@/db/schema/order";
import type { rejectCodes, statusPedidos } from "@/utils/types/orders";
import { buildUpdateSet } from "@/utils/updateUtilities";
import { and, eq, gte, lte, sql } from "drizzle-orm";

export const createOrder = db
	.insert(Orders)
	.values({
		id: sql.placeholder("id"),
		clientId: sql.placeholder("clientId"),
		orderNumber: sql.placeholder("orderNumber"),
		totalAmount: sql.placeholder("totalAmount"),
		status: sql.placeholder("status"),
		rejectionCode: sql.placeholder("rejectionCode"),
		orderDate: sql.placeholder("orderDate"),
		deliveryDate: sql.placeholder("deliveryDate"),
		notes: sql.placeholder("notes"),
	})
	.prepare();

export const getOrdersByStatus = db
	.select()
	.from(Orders)
	.where(eq(Orders.status, sql.placeholder("status")))
	.prepare();

export const getOrdersByDateRange = db
	.select()
	.from(Orders)
	.where(
		and(
			gte(Orders.orderDate, sql.placeholder("startDate")),
			lte(Orders.orderDate, sql.placeholder("endDate"))
		)
	)
	.prepare();

export const updateOrder = (
	clientId?: string,
	totalAmount?: string,
	status?: statusPedidos,
	codes?: rejectCodes,
	orderDate?: Date,
	deliveryDate?: Date,
	notes?: string
) =>
	db
		.update(Orders)
		.set(
			buildUpdateSet({
				clientId,
				totalAmount,
				status,
				rejectionCode: codes,
				orderDate,
				deliveryDate,
				notes,
			})
		)
		.where(eq(Orders.id, sql.placeholder("id")))
		.prepare();
*/