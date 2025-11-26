import * as v from "valibot";

export const normalizeKey = (key: string): string => {
	return key
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]/g, ""); // Esto elimina puntos, guiones bajos, etc.
};


const HEADER_MAP_PEDIDOS: Record<string, string> = {
	// Variantes de Solic
	solic: "Solic",
	solicitud: "Solic",
	empty2: "Solic",

	// Variantes de Establecimiento (opcional)
	establecimiento: "Establecimiento",
	empty3: "Establecimiento",

	estado: "Estado",
	estadopedido: "Estado",
	estadodelorder: "Estado",
	tipo: "Estado",
	tipopedido: "Estado",
	estadodelpedido: "Estado",
};

// Schema para el estado del pedido
export const estadoPedidoSchema = v.pipe(
	v.string(),
	v.transform((val) => val.toUpperCase().trim()),
	v.picklist(
		["EN RUTA", "SEGUNDO VIAJE", "APLAZADO"],
		"El estado debe ser: EN RUTA, SEGUNDO VIAJE o APLAZADO"
	)
);

export const uploadPedidosPorEstado = v.looseObject({
	Solic: v.pipe(
		v.union([v.string(), v.number()]),
		v.transform((value) => String(value).trim()),
		v.minLength(1, "El número de solicitud no puede estar vacío")
	),

	Establecimiento: v.optional(
		v.pipe(
			v.string(),
			v.transform((val) => val.trim())
		)
	),

	// Estado ahora es opcional: si existe lo validas; si no, sigues igual
	Estado: v.optional(estadoPedidoSchema),
});

// Schema principal para pedidos por estado
export const uploadPedidosPorEstado2 = v.looseObject({
	Solic: v.pipe(
		v.union([v.string(), v.number()]),
		v.transform((value) => String(value).trim())
	),
	Establecimiento: v.pipe(
		v.string(),
		v.transform((val) => val.trim()),
		v.minLength(1, "El establecimiento no puede estar vacío")
	),
	Estado: estadoPedidoSchema,
});

export type UploadPedidosPorEstado = v.InferOutput<
	typeof uploadPedidosPorEstado
>;

// Función para normalizar las filas
export const normalizeRowPedidos = (
	row: Record<string, unknown>
): Record<string, unknown> => {
	const normalized: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(row)) {
		const normalizedKey = normalizeKey(key);
		const mappedKey = HEADER_MAP_PEDIDOS[normalizedKey];

		if (mappedKey) {
			normalized[mappedKey] = value;
		}
	}

	return normalized;
};

// Función principal de validación
export const validateAndFilterPedidosPorEstado = (data: unknown[]) => {
	const validRows: UploadPedidosPorEstado[] = [];
	const invalidRows: {
		row: number;
		data: unknown;
		errors: string[];
	}[] = [];

	// Agrupar por estado
	const grouped: {
		enRuta: UploadPedidosPorEstado[];
		segundoViaje: UploadPedidosPorEstado[];
		aplazado: UploadPedidosPorEstado[];
	} = {
		enRuta: [],
		segundoViaje: [],
		aplazado: [],
	};

	data.forEach((row, index) => {
		try {
			const normalizedRow = normalizeRowPedidos(row as Record<string, unknown>);

			// Verificar si la fila tiene los datos mínimos necesarios
			if (!normalizedRow.Solic || !normalizedRow.Estado) {
				// Saltar filas que parecen ser encabezados o están incompletas
				invalidRows.push({
					row: index + 2,
					data: row,
					errors: ["Fila incompleta o encabezado - faltan columnas requeridas"],
				});
				return;
			}

			const result = v.safeParse(uploadPedidosPorEstado, normalizedRow);

			if (result.success) {
				validRows.push(result.output);

				// Agrupar por estado
				switch (result.output.Estado) {
					case "EN RUTA":
						grouped.enRuta.push(result.output);
						break;
					case "SEGUNDO VIAJE":
						grouped.segundoViaje.push(result.output);
						break;
					case "APLAZADO":
						grouped.aplazado.push(result.output);
						break;
				}
			} else {
				const errors = result.issues.map(
					(issue) =>
						`${issue.path?.map((p) => p.key).join(".") || "Campo"}: ${
							issue.message
						}`
				);
				invalidRows.push({
					row: index + 2,
					data: row,
					errors,
				});
			}
		} catch (error) {
			invalidRows.push({
				row: index + 2,
				data: row,
				errors: [error instanceof Error ? error.message : "Error desconocido"],
			});
		}
	});

	return {
		validRows,
		invalidRows,
		grouped,
		summary: {
			total: data.length,
			valid: validRows.length,
			invalid: invalidRows.length,
			enRuta: grouped.enRuta.length,
			segundoViaje: grouped.segundoViaje.length,
			aplazado: grouped.aplazado.length,
		},
	};
};

/*

				!normalizedRow.Establecimiento ||

if (!normalizedRow.Solic) {
				invalidRows.push({
					row: index + 2,
					data: row,
					errors: ["Fila inválida: falta Solic (obligatorio)"],
				});
				return;
			}
*/
