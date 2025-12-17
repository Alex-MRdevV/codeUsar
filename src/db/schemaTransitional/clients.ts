import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const clientsData = sqliteTable("clientsData", {
	id: text("id").primaryKey(),
	code: text("code"),
	name: text("name"),
	phoneNumberMain: text("phoneNumberMain").notNull(),
	phoneNumberSecond: text("phoneNumberSecond"),
	phoneNumberThird: text("phoneNumberSecond"),
	date: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text("updated_at")
		.default(sql`( DATETIME('now','localtime'))`)
		.$onUpdate(() => sql`( DATETIME('now','localtime'))`),
});
