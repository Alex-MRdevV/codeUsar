import { type Database } from "@/db/db";
import { userStats } from "@/db/schema/userStats";
import { Users } from "@/db/schema/users";
import { buildUpdateSet } from "@/utils/updateUtilities";
import { eq, sql, and,ne } from "drizzle-orm";

export const createUserStats = (db: Database) =>  db
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

export const getUserStats = (db: Database) => db
	.select()
	.from(userStats)
	.innerJoin(Users, eq(userStats.userId, Users.id))
	.where(
		and(
			eq(userStats.userId, sql.placeholder("userId")),
			ne(Users.status, "retirado")
		)
);
	
export const updateUserStats = (
	db: Database,
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
				
			})
		)
		.where(eq(userStats.userId, userId))
		.prepare();
