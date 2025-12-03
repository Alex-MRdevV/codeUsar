import { addConsolidatedClient } from "@/lib/drizzle/data";
import type { ResultadoAgrupado } from "@/utils/types/consolidadoData";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = (await request.json()) as ResultadoAgrupado;

		if (!body?.byStatus) {
			return new Response(
				JSON.stringify({ message: "Faltan datos: byStatus no existe" }),
				{ status: 400 }
			);
		}

		const { enRuta, segundoViaje, aplazado } = body.byStatus;
		const collected = [...enRuta, ...segundoViaje, ...aplazado];
		const results: any[] = [];

		const mapStatus = (
			estado: string
		): "enRuta" | "segundoViaje" | "aplazado" => {
			switch (estado.toUpperCase()) {
				case "EN RUTA":
					return "enRuta";
				case "SEGUNDO VIAJE":
					return "segundoViaje";
				case "APLAZADO":
					return "aplazado";
				default:
					throw new Error(`Estado no reconocido: ${estado}`); // ✅ Corregido
			}
		};

		for (const cliente of collected) {
			const payload = {
				idCliente: cliente.idCliente,
				nameEstablecimiento: cliente.nameEstablecimiento ?? null,
				phoneNumber: cliente.phoneNumber ?? null,
				status: mapStatus(cliente.Estado),
				clienteId: cliente.clienteId ?? null,
				horaInicial: cliente.horaInicial ?? null,
				horaFinal: cliente.horaFinal ?? null,
			};

			const inserted = await addConsolidatedClient(payload);
			results.push(inserted);
		}

		return new Response(
			JSON.stringify({
				message: "Datos del consolidado insertados correctamente",
				insertados: results.length,
				data: results,
			}),
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({
				message: "Error interno al insertar consolidado",
				error: (error as Error).message,
			}),
			{ status: 500 }
		);
	}
};
