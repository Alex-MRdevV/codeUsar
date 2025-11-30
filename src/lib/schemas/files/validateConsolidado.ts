import {
	uploadDataConsolidada,
	type dataConsolidada,
} from "@/lib/schemas/files/consolidado";
import { safeParse } from "valibot";

export const validateAndFilterData = (rows: unknown[]) => {
	const processedRows = rows.map((rawRow, index) => {
		const rowNumber = index + 2;

		try {
			const normalizedRow = rawRow as Record<string, unknown>;
			const result = safeParse(uploadDataConsolidada, normalizedRow);

			if (!result.success) {
				const errors = result.issues.map((issue) => {
					const path = issue.path?.map((p) => p.key).join(".") || "Campo";
					return `${path}: ${issue.message}`;
				});
				return { valid: false, rowNumber, errors } as const;
			}

			const data = result.output;
			const additionalErrors: string[] = [];

			// Validación de horas
			if (data.horaInicial && data.horaFinal) {
				const timeComparison = compareTimes(data.horaInicial, data.horaFinal);
				if (timeComparison !== -1) {
					additionalErrors.push(
						`horaInicial (${data.horaInicial}) debe ser menor que horaFinal (${data.horaFinal})`
					);
				}
			}

			if (additionalErrors.length > 0) {
				return { valid: false, rowNumber, errors: additionalErrors } as const;
			}

			return {
				valid: true,
				rowNumber,
				data,
			} as const;
		} catch (error) {
			return {
				valid: false,
				rowNumber,
				errors: [error instanceof Error ? error.message : "Error desconocido"],
			} as const;
		}
	});

	// Separar filas válidas e inválidas
	const validRows = processedRows.filter(
		(row): row is { valid: true; rowNumber: number; data: dataConsolidada } =>
			row.valid
	);
	const invalidRows = processedRows
		.filter((row) => !row.valid)
		.map((row) => ({
			row: row.rowNumber,
			errors: row.errors,
		}));

	// Crear mapa para búsqueda rápida por idCliente
	const clientMap = new Map<string, dataConsolidada>();
	validRows.forEach((row) => {
		clientMap.set(row.data.idCliente, row.data);
	});

	// Procesar filas válidas haciendo el matching y agrupando por estado
	const { enRuta, segundoViaje, aplazado } = validRows.reduce(
		(acc, row) => {
			const currentData = row.data;

			// Buscar matching por idCliente -> clienteId
			const matchingClient = clientMap.get(currentData.clienteId);

			const processedData: dataConsolidada = matchingClient
				? {
						...currentData,
						// Asignar las horas del cliente encontrado
						horaInicial: matchingClient.horaInicial,
						horaFinal: matchingClient.horaFinal,
				  }
				: currentData;

			// Agrupar por estado
			switch (processedData.Estado) {
				case "EN RUTA":
					acc.enRuta.push(processedData);
					break;
				case "SEGUNDO VIAJE":
					acc.segundoViaje.push(processedData);
					break;
				case "APLAZADO":
					acc.aplazado.push(processedData);
					break;
			}
			return acc;
		},
		{
			enRuta: [] as dataConsolidada[],
			segundoViaje: [] as dataConsolidada[],
			aplazado: [] as dataConsolidada[],
		}
	);

	const validCount = validRows.length;

	return {
		byStatus: {
			enRuta,
			segundoViaje,
			aplazado,
		},
		summary: {
			total: rows.length,
			valid: validCount,
			invalid: invalidRows.length,
			enRuta: enRuta.length,
			segundoViaje: segundoViaje.length,
			aplazado: aplazado.length,
		},
		invalidRows,
	};
};

// Función helper optimizada para comparación de tiempos
const compareTimes = (time1: string, time2: string): number => {
	if (time1.length === time2.length) {
		return time1.localeCompare(time2);
	}

	const time1Num = parseFloat(time1.replace(/:/g, "."));
	const time2Num = parseFloat(time2.replace(/:/g, "."));
	if (isNaN(time1Num) || isNaN(time2Num)) return 0;
	return time1Num - time2Num > 0 ? 1 : time1Num - time2Num < 0 ? -1 : 0;
};
