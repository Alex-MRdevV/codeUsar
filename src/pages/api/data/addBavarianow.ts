import { addBavariaClient } from "@/lib/drizzle/data";
import type { ResultadoAgrupado } from "@/utils/types/bavariaNowData";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = (await request.json()) as ResultadoAgrupado;

		// Validación básica
		if (!body || !body.groupedOrders) {
			return new Response(
				JSON.stringify({ message: "Datos inválidos: falta groupedOrders" }),
				{ status: 400 }
			);
		}

		const insertResults: any[] = [];

		// Iteramos sobre cada cliente agrupado
		for (const key of Object.keys(body.groupedOrders)) {
			const cliente = body.groupedOrders[key];

			if (!cliente?.clienteInfo?.id) continue;

			// Construcción de payload para DB
			const payload = {
				clienteId: cliente.clienteInfo.id,
				nombre: cliente.clienteInfo.nombre ?? null,
			};

			// Insertar en BD
			const inserted = await addBavariaClient(payload);
			insertResults.push(inserted);
		}

		return new Response(
			JSON.stringify({
				message: "Datos insertados correctamente",
				insertados: insertResults.length,
				data: insertResults,
			}),
			{ status: 200 }
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				message: "Error interno al procesar los datos",
				error: (error as Error).message,
			}),
			{ status: 500 }
		);
	}
};
