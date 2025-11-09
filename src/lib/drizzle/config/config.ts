import { WhatsAppConfig } from "@/db/schema/configMeta";
import type { Database } from "@/utils/db";
import { eq, sql } from "drizzle-orm";

// Crear configuración de WhatsApp
export const createWhatsAppConfig = (db: Database) => db
  .insert(WhatsAppConfig)
  .values({
    id: sql.placeholder('id'),
    userId: sql.placeholder('userId'),
    productionPhoneNumberId: sql.placeholder('productionPhoneNumberId'),
    productionPhoneNumber: sql.placeholder('productionPhoneNumber'),
    testPhoneNumberId: sql.placeholder('testPhoneNumberId'),
    testPhoneNumber: sql.placeholder('testPhoneNumber'),
    wabaId: sql.placeholder('wabaId'),
  })
  .prepare();

// Actualizar configuración de WhatsApp
export const updateWhatsAppConfig = (db: Database, idConfig: string, config: {
	productionPhoneNumberId: string
	productionPhoneNumber: string
	testPhoneNumberId: string
	testPhoneNumber: string
	wabaId: string
}) => db
  .update(WhatsAppConfig)
  .set({
    productionPhoneNumberId: config.productionPhoneNumberId,
    productionPhoneNumber: config.productionPhoneNumber,
    testPhoneNumberId: config.testPhoneNumberId,
    testPhoneNumber: config.testPhoneNumber,
    wabaId: config.wabaId,
  })
  .where(eq(WhatsAppConfig.id, idConfig))
  .prepare();

// Obtener configuración por usuario
export const getWhatsAppConfigByUser =  (db: Database) => db
  .select()
  .from(WhatsAppConfig)
  .where(eq(WhatsAppConfig.userId, sql.placeholder('userId')))
  .prepare();
