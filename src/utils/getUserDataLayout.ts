// utils/userData.ts
import { User } from "@/db/schema/users";
import { db } from "@/lib/db";
import type { dataUserSidebar, PropsNavMain } from "@/utils/types/sidebar";
import type { AstroGlobal } from "astro";
import { eq } from "drizzle-orm";

export async function getUserSidebarData(
	Astro: AstroGlobal,
	sidebarDataItems: PropsNavMain
) {
	// --- Obtener locals y conexión a la base de datos ---
	const { locals } = Astro;

	// --- Obtener userId desde la sesión ---
	const sessionUser = locals.user ?? null;
	const userId = (sessionUser?.id as string) ?? null;

	if (!userId) {
		throw new Error("Usuario no autenticado o sin ID válido.");
	}

	// --- Obtener email desde la tabla User ---
	const userRow = await db
		.select({ email: User.email })
		.from(User)
		.where(eq(User.id, userId))
		.get();

	const email = userRow?.email ?? "usuario@ejemplo.com";
	const nombreUser = (sessionUser?.nombre as string) ?? "Usuario";

	// --- Construir data para Layout ---
	const data: dataUserSidebar = {
		items: sidebarDataItems,
		user: {
			name: nombreUser,
			email,
		},
	};

	return data;
}
