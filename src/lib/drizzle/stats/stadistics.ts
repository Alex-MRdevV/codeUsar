/*
import { db } from "@/db/db";
import { User } from "@/db/schema/user";
import { userStats } from "@/db/schema/user-stats";
import { buildUpdateSet } from "@/utils/updateUtilities";
import { and, eq, ne, sql } from "drizzle-orm";

export const getUserStats = db
	.select()
	.from(userStats)
	.innerJoin(User, eq(userStats.userId, User.id))
	.where(
		and(
			eq(userStats.userId, sql.placeholder("userId")),
			ne(User.status, "retirado")
		)
	);

export const updateUserStats = (
	userId: string,
	totalMessagesSent?: number,
	totalTimeSavedHours?: number,
	totalContacts?: number,
	lastUpdated?: Date
) =>
	db
		.update(userStats)
		.set(
			buildUpdateSet({
				totalMessagesSent,
				totalTimeSavedHours,
				totalContacts,
				lastUpdated,
			})
		)
		.where(eq(userStats.userId, userId))
		.prepare();

export const createUserStats = db
	.insert(userStats)
	.values({
		id: sql.placeholder("id"),
		userId: sql.placeholder("userId"),
		totalMessagesSent: sql.placeholder("totalMessagesSent"),
		totalContacts: sql.placeholder("totalContacts"),
		totalOrders: sql.placeholder("totalOrders"),
		totalTimeSavedHours: sql.placeholder("totalTimeSavedHours"),
		lastMessageAt: sql.placeholder("lastMessageAt")
	})
	.prepare();
*/