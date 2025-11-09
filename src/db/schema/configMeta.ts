import { User } from "@/db/schema/users";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const WhatsAppConfig = sqliteTable(
	"WhatsAppConfig",
	{
		id: text("id").primaryKey(),
		userId: text("userId").references(() => User.id, { onDelete: "cascade" }),
		// Número de producción
		productionPhoneNumberId: text("productionPhoneNumberId").notNull(),
		productionPhoneNumber: text("productionPhoneNumber").notNull(), // Ej: +573001234567
		// Número de prueba
		testPhoneNumberId: text("testPhoneNumberId").notNull(),
		testPhoneNumber: text("testPhoneNumber").notNull(),
		wabaId: text("wabaId").notNull(), // WhatsApp Business Account ID
	},
	(table) => [index("userId_whatsapp_idx").on(table.userId)]
);
