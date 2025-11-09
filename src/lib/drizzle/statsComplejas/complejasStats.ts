import { Clients } from "@/db/schema/clients";
import { Clients_Pedido } from "@/db/schema/clientsPedido";
import { Messages } from "@/db/schema/messages";
import { Pedido } from "@/db/schema/pedido";
import { User } from "@/db/schema/users";
import { UserStats } from "@/db/schema/userStats";
import type { Database } from "@/utils/db";
import { and, eq, ne, sql } from "drizzle-orm";

// Obtener estadísticas completas del usuario
export const getUserCompleteStats = (db: Database) =>
	db
		.select({
			userStats: UserStats,
			totalMessages: sql<number>`COUNT(${Messages.id})`.as("totalMessages"),
			activeClients:
				sql<number>`COUNT(CASE WHEN ${Clients.estado} = 'activo' THEN 1 END)`.as(
					"activeClients"
				),
			pendingOrders:
				sql<number>`COUNT(CASE WHEN ${Pedido.estado} = 'Por entregar' THEN 1 END)`.as(
					"pendingOrders"
				),
			user: User,
		})
		.from(UserStats)
		.innerJoin(User, eq(UserStats.userId, User.id))
		.leftJoin(Messages, eq(Messages.userId, UserStats.userId))
		.leftJoin(Clients, eq(Clients.id, Messages.clientId))
		.leftJoin(Clients_Pedido, eq(Clients_Pedido.cliente, Clients.id))
		.leftJoin(Pedido, eq(Pedido.id, Clients_Pedido.pedido))
		.where(
			and(
				eq(UserStats.userId, sql.placeholder("userId")),
				ne(User.estado, "retirado")
			)
		)
		.groupBy(UserStats.id)
		.prepare();
