import * as v from "valibot";
import { normalizeKey } from "@/lib/schemas/files/validarPedidos";

// Mapa de encabezados normalizados a nombres esperados
const HEADER_MAP: Record<string, string> = {
	cliente: "Cliente",
	material_id: "Material",
	material: "Material",
	fechapref: "Fecha preferente",
	fecha_pref: "Fecha preferente",
	motivorechazo: "Motivo Rechazo",
	motivo_rechazo: "Motivo Rechazo",
};

// Schema Valibot
const pedidoSchema = v.looseObject({
	Cliente: v.string([v.minLength(1, "Cliente requerido")]),
	Material: v.string([v.minLength(1, "Material requerido")]),
	"Fecha preferente": v.string([v.minLength(1, "Fecha preferente requerida")]),
	"Motivo Rechazo": v.optional(v.string()),
});


export type PedidoSchema = v.InferOutput<typeof pedidoSchema>;

// Normalizar fila del Excel
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
			normalized[key] = value; // Por si hay columnas adicionales
		}
	}

	return normalized;
};

// Función principal de validación
export const validateAndFilterPedidos = (rows: unknown[]) => {
	const validRows: PedidoSchema[] = [];
	const invalidRows: {
		row: number;
		data: unknown;
		errors: string[];
	}[] = [];

	rows.forEach((rawRow, index) => {
		try {
			const normalizedRow = normalizeRow(rawRow as Record<string, unknown>);

			const result = v.safeParse(pedidoSchema, normalizedRow);

			if (result.success) {
				validRows.push(result.output);
			} else {
				const errores = result.issues.map((issue) => {
					const path = issue.path?.map((p) => p.key).join(".") || "Campo";
					return `${path}: ${issue.message}`;
				});

				invalidRows.push({
					row: index + 2, // +2 porque row[0] = header
					data: rawRow,
					errors: errores,
				});
			}
		} catch (error) {
			invalidRows.push({
				row: index + 2,
				data: rawRow,
				errors: [error instanceof Error ? error.message : "Error desconocido"],
			});
		}
	});

	return { validRows, invalidRows };
};
