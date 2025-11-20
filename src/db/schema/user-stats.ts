import { User } from "@/db/schema/user";
import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const userStats = mysqlTable("User_stats", {
	id: varchar("id", { length: 191 }).primaryKey(),
	userId: varchar("user_id", { length: 191 })
		.notNull()
		.references(() => User.id, { onDelete: "cascade" })
		.unique(),
	totalMessagesSent: int("total_messages_sent").default(0).notNull(),
	totalContacts: int("total_contacts").default(0).notNull(),
	totalOrders: int("total_orders").default(0).notNull(),
	// Métricas de tiempo
	totalTimeSavedHours: int("total_time_saved_hours").default(0).notNull(),
	lastMessageAt: timestamp("last_message_at"),
	lastUpdated: timestamp("last_updated").defaultNow().onUpdateNow(),
});
