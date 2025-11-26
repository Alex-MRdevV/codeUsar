import { Users } from "@/db/schema/users";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userStats = sqliteTable("User_stats", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => Users.id, { onDelete: "cascade" })
		.unique(),
	totalMessagesSent: integer("total_messages_sent").default(0).notNull(),
	totalContacts: integer("total_contacts").default(0),
	totalOrders: integer("total_orders").default(0),
	// Métricas de tiempo
	totalTimeSavedHours: integer("total_time_saved_hours").default(0).notNull(),
	lastMessageAt: integer("created_at", { mode: "timestamp_ms" }).default(
		sql`(unixepoch() * 1000)`
	),
	lastUpdated: text("updated_at")
		.default(sql`( DATETIME('now','localtime'))`)
		.$onUpdate(() => sql`( DATETIME('now','localtime'))`),
});
