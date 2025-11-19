import * as v from "valibot";

export const normalizeKey = (key: string): string => {
	return key
		.toLowerCase()
		.normalize("NFD") // Descompone caracteres con tildes
		.replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos
		.replace(/[^a-z0-9]/g, ""); // Elimina caracteres especiales
};

// Mapa de encabezados normalizados a nombres esperados
const HEADER_MAP: Record<string, string> = {
	cliente: "Cliente",
	nombre: "Nombre",
	cashless: "Cashless",
	telefono: "Telefono",
	documento: "Documento",
	cajas: "Cajas",
};

// Schema de teléfono
export const phoneSchema = v.pipe(
	v.union([v.number(), v.string()]),
	v.transform((value) => String(value).replace(/\D/g, "")), // Elimina no-dígitos
	v.regex(
		/^\d{10}$/,
		"El teléfono debe contener exactamente 10 dígitos numéricos"
	)
);

// Schema principal
export const uploadConfirmationPedidos = v.looseObject({
	Cliente: v.union([v.string(), v.number()]),
	Nombre: v.string(),
	Cashless: v.pipe(
		v.string(),
		v.transform((val) => val.toUpperCase()),
		v.picklist(["SI", "NO"])
	),
	Telefono: phoneSchema,
	Documento: v.union([v.number(), v.string()]),
	Cajas: v.pipe(
		v.union([v.number(), v.string()]),
		v.transform((value) => {
			const num = typeof value === "number" ? value : parseFloat(value);
			if (isNaN(num)) throw new Error("Debe ser un número válido");
			return num;
		})
	),
});

export type UploadConfirmationPedidos = v.InferOutput<
	typeof uploadConfirmationPedidos
>;

// Función para normalizar las filas del Excel
export const normalizeRow = (
	row: Record<string, unknown>
): Record<string, unknown> => {
	const normalized: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(row)) {
		const normalizedKey = normalizeKey(key);
		const mappedKey = HEADER_MAP[normalizedKey];

		if (mappedKey) {
			normalized[mappedKey] = value;
		} else {
			// Mantener columnas no mapeadas (por si acaso)
			normalized[key] = value;
		}
	}

	return normalized;
};

// Función principal de validación
export const validateAndFilterPedidos = (data: unknown[]) => {
	const validRows: UploadConfirmationPedidos[] = [];
	const invalidRows: {
		row: number;
		data: unknown;
		errors: string[];
	}[] = [];

	data.forEach((row, index) => {
		try {
			// Normalizar los encabezados primero
			const normalizedRow = normalizeRow(row as Record<string, unknown>);

			// Validar con el schema
			const result = v.safeParse(uploadConfirmationPedidos, normalizedRow);

			if (result.success) {
				validRows.push(result.output);
			} else {
				// Extraer mensajes de error más legibles
				const errors = result.issues.map(
					(issue) =>
						`${issue.path?.map((p) => p.key).join(".") || "Campo"}: ${
							issue.message
						}`
				);

				invalidRows.push({
					row: index + 2, // +2 porque index empieza en 0 y hay fila de encabezado
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

	return { validRows, invalidRows };
};

// Ejemplo de uso
/*
const excelData = [
	{ "CLIENTE": 123, "Nombre": "Juan", "TELÉFONO": "3001234567", "Cashless": "si", "Documento": "123456", "Cajas": "5" },
	{ "cliente": 456, "nombre": "María", "telefono": 3009876543, "cashless": "NO", "documento": 789012, "cajas": 3 },
	{ "Cliente": 789, "Nombre": "Pedro", "Teléfono": "300123", "Cashless": "SI", "Documento": "345678", "Cajas": 2 }, // Inválido
];

const resultado = validateAndFilterPedidos(excelData);
console.log("Válidos:", resultado.validRows);
console.log("Inválidos:", resultado.invalidRows);
*/
