import {
	allClientMensajes,
	getAllConsolidatedClients,
} from "@/lib/drizzle/data";
import type {
	dataUsar,
	dataUsarMessages,
	PersistedConsolidado,
	ReducedCliente,
} from "@/utils/types/messages";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
	try {
		// Obtener ambas fuentes de datos
		const [consolidatedClients, clientMensajes] = await Promise.all([
			getAllConsolidatedClients(),
			allClientMensajes(),
		]);

		// Procesar datos consolidados
		const dataConsolidado: PersistedConsolidado = {
			byStatus: {
				enRuta: [],
				segundoViaje: [],
				aplazado: [],
			},
		};

		consolidatedClients.forEach((client) => {
			// Validar que existan los campos requeridos
			if (!client.phoneNumber || !client.clienteId) {
				return; // Saltar clientes sin datos esenciales
			}

			const reducedClient: ReducedCliente = {
				phoneNumber: client.phoneNumber,
				clienteId: client.clienteId,
				nameEstablecimiento: client.nameEstablecimiento ?? undefined,
				horaInicial: client.horaInicial ?? undefined,
				horaFinal: client.horaFinal ?? undefined,
			};

			// Validar que existe el status antes de clasificar
			if (!client.status) {
				return; // Saltar clientes sin status
			}

			// Clasificar por status
			if (client.status === "enRuta") {
				dataConsolidado.byStatus.enRuta.push(reducedClient);
			} else if (client.status === "segundoViaje") {
				dataConsolidado.byStatus.segundoViaje.push(reducedClient);
			} else if (client.status === "aplazado") {
				dataConsolidado.byStatus.aplazado.push(reducedClient);
			}
		});

		// Procesar mensajes para crear dataUsar[]
		const dataMessage: dataUsar[] = [];

		const validMessageTypes = [
			"pedidos_no_planeados",
			"pedidos_retrasados",
			"confirmar_pedido",
			"confirmacion_de_pedido",
		] as const;

		clientMensajes.forEach((client) => {
			// Validar que existan los campos requeridos
			if (!client.phoneNumber || !client.nombre) {
				return; // Saltar clientes sin datos esenciales
			}

			// Validar y asignar typeMessage
			const typeMessage = validMessageTypes.includes(client.mensaje as any)
				? (client.mensaje as dataUsar["typeMessage"])
				: "pedidos_retrasados"; // valor por defecto

			const mensaje: dataUsar = {
				name: client.nombre,
				phone: client.phoneNumber,
				typeMessage: typeMessage,
			};

			dataMessage.push(mensaje);
		});

		// Preparar respuesta
		const responseData: dataUsarMessages = {
			dataMessage,
			dataConsolidado,
		};

		return new Response(JSON.stringify(responseData), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Error al obtener datos:", error);
		return new Response(
			JSON.stringify({
				error: "Error al obtener los datos",
				message: error instanceof Error ? error.message : "Error desconocido",
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}
};
