import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const User = sqliteTable(
	"User",
	{
		id: text("id").primaryKey(),
		email: text("correo").notNull().unique(),
		password: text("password").notNull(),
		nombre: text("primerNombre").notNull(),
		apellido: text("primerApellido").notNull(),
		estado: text("estado", { enum: ["activo", "retirado"] }).default("activo"),
		rol: text("rol", { enum: ["admin", "user"] }).notNull(),
		secretUserJWT: text("secretUserJWT").notNull(),
	},
	(table) => [
		index("estado_user_idx").on(table.estado),
		index("correo_user_idx").on(table.email),
	]
);
