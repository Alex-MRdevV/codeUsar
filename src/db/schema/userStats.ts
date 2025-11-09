import { User } from "@/db/schema/users";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const UserStats = sqliteTable("UserStats", {
	id: text("id").primaryKey(),
	userId: text("userId").references(() => User.id, { onDelete: "cascade" }),
	totalMessagesSent: integer("totalMessagesSent").default(0),
	totalTimeSavedHours: integer("totalTimeSavedHours").default(0),
	totalContacts: integer("totalContacts").default(0),
	lastUpdated: integer("lastUpdated", { mode: "timestamp" }).notNull(),
});
