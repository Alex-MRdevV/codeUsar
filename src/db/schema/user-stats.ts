import { User } from "@/db/schema/user";
import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const UserStats = mysqlTable("UserStats", {
	id: varchar("id", { length: 191 }).primaryKey(),
	userId: varchar("userId", { length: 191 }).references(() => User.id),
	totalMessagesSent: int("totalMessagesSent").notNull(),
	totalTimeSavedHours: int("totalTimeSavedHours").notNull(),
	totalContacts: int("totalContacts").notNull(),
	lastUpdate: timestamp("lastUpdate", { fsp: 3 }).defaultNow().onUpdateNow(),
});
