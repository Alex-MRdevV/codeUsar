import { WhatsAppConfig } from "@/db/schema/configMeta";
import { User } from "@/db/schema/users";
import type { Database } from "@/utils/db";
import { and, eq, ne, sql } from "drizzle-orm";

// Obtener configuración por usuario
export const getWhatsAppConfigByActiveUser = (db: Database) =>
	db
		.select({
			config: WhatsAppConfig,
			user: User,
		})
		.from(WhatsAppConfig)
		.innerJoin(User, eq(WhatsAppConfig.userId, User.id))
		.where(
			and(
				eq(WhatsAppConfig.userId, sql.placeholder("userId")),
				ne(User.estado, "retirado")
			)
		)
		.prepare();
