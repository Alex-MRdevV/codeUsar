import { User } from "@/db/schema/users";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const WhatsAppConfig = sqliteTable(
	"WhatsAppConfig",
	{
		id: text("id").primaryKey(),
		userId: text("userId").references(() => User.id, { onDelete: "cascade" }),
		// Números telefónicos por tipo
		productionPhoneId: text("productionPhoneId").notNull(),
		productionPhoneNumber: text("productionPhoneNumber").notNull(),
		productionPhoneName: text("productionPhoneName").notNull(), // Nuevo campo

		previewPhoneId: text("previewPhoneId"), // Cambiado a opcional
		previewPhoneNumber: text("previewPhoneNumber"), // Cambiado a opcional
		previewPhoneName: text("previewPhoneName"), // Nuevo campo

		developmentPhoneId: text("developmentPhoneId"), // Cambiado a opcional
		developmentPhoneNumber: text("developmentPhoneNumber"), // Cambiado a opcional
		developmentPhoneName: text("developmentPhoneName"), // Nuevo campo
	},
	(table) => [index("userId_whatsapp_idx").on(table.userId)]
);
