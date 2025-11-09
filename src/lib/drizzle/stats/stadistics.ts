import { User } from "@/db/schema/users";
import { UserStats } from "@/db/schema/userStats";
import { type Database } from "@/utils/db";
import { and, eq, ne, sql } from "drizzle-orm";

// Obtener estadísticas del usuario
export const getUserStats = (db: Database) =>
	db
		.select({
			userStats: UserStats,
			user: User,
		})
		.from(UserStats)
		.innerJoin(User, eq(UserStats.userId, User.id))
		.where(
			and(
				eq(UserStats.userId, sql.placeholder("userId")),
				ne(User.estado, "retirado")
			)
		)
		.prepare();

// Actualizar estadísticas del usuario
export const updateUserStats = (
	db: Database,
	userId: string,
	stats: {
		totalMessagesSent: number;
		totalTimeSavedHours: number;
		totalContacts: number;
		lastUpdated: Date;
	}
) =>
	db
		.update(UserStats)
		.set({
			totalMessagesSent: stats.totalMessagesSent,
			totalTimeSavedHours: stats.totalTimeSavedHours,
			totalContacts: stats.totalContacts,
			lastUpdated: stats.lastUpdated,
		})
		.where(eq(UserStats.userId, userId))
		.prepare();

// Crear estadísticas de usuario
export const createUserStats = (db: Database) =>
	db
		.insert(UserStats)
		.values({
			id: sql.placeholder("id"),
			userId: sql.placeholder("userId"),
			totalMessagesSent: sql.placeholder("totalMessagesSent"),
			totalTimeSavedHours: sql.placeholder("totalTimeSavedHours"),
			totalContacts: sql.placeholder("totalContacts"),
			lastUpdated: sql.placeholder("lastUpdated"),
		})
		.prepare();
