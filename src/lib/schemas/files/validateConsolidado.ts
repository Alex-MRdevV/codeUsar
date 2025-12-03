import {
	uploadDataConsolidada,
	type dataConsolidada,
} from "@/lib/schemas/files/consolidado";
import { safeParse } from "valibot";

export const processConsolidadoData = (rows: dataConsolidada[]) => {
	// Crear mapa para buscar por idCliente
	const clientMap = new Map<string, dataConsolidada>();
	rows.forEach((row) => {
		clientMap.set(row.idCliente, row);
	});

	// Agrupar
	const result = {
		enRuta: [] as dataConsolidada[],
		segundoViaje: [] as dataConsolidada[],
		aplazado: [] as dataConsolidada[],
	};

	rows.forEach((row) => {
		// Matching por idCliente -> clienteId
		const matchingClient = clientMap.get(row.clienteId);

		const processedRow: dataConsolidada = matchingClient
			? {
					...row,
					horaInicial: matchingClient.horaInicial,
					horaFinal: matchingClient.horaFinal,
			  }
			: row;

		// Agrupar por status
		switch (processedRow.status) {
			case "EN RUTA":
				result.enRuta.push(processedRow);
				break;
			case "SEGUNDO VIAJE":
				result.segundoViaje.push(processedRow);
				break;
			case "APLAZADO":
				result.aplazado.push(processedRow);
				break;
		}
	});

	return {
		byStatus: result,
		summary: {
			total: rows.length,
			enRuta: result.enRuta.length,
			segundoViaje: result.segundoViaje.length,
			aplazado: result.aplazado.length,
		},
	};
};
