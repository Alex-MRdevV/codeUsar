import type { ExcelRow } from "@/utils/types/files";

export function validateRow(row: unknown): ExcelRow | null {
	if (!row || typeof row !== "object") {
		return null;
	}

	const validRow = row as Record<string, unknown>;

	// Buscar nombre (flexible con diferentes variaciones)
	const nombre =
		validRow.Nombre ||
		validRow.nombre ||
		validRow.NOMBRE ||
		validRow["Nombre 3"] ||
		validRow["nombre 3"] ||
		validRow["NOMBRE 3"];

	// Buscar teléfono (flexible con diferentes variaciones)
	const celular =
		validRow.Celular ||
		validRow.celular ||
		validRow.CELULAR ||
		validRow.Telefono ||
		validRow.telefono ||
		validRow.TELEFONO ||
		validRow.phoneNumber ||
		validRow["Teléfono 1"] ||
		validRow["telefono 1"] ||
		validRow["TELÉFONO 1"] ||
		validRow["Telefono 1"];

	if (!nombre || !celular) return null;

	// Limpiar el número de teléfono (remover espacios, guiones, etc.)
	let celularLimpio = String(celular).trim().replace(/[\s-]/g, "");

	if (celularLimpio === "0" || celularLimpio === "") return null;

	if (celularLimpio.startsWith("60")) return null;

	if (celularLimpio.length === 11) {
		celularLimpio = celularLimpio.substring(1);
	}

	if (celularLimpio.length !== 10) return null;

	return {
		Nombre: String(nombre).trim(),
		Celular: celularLimpio,
	};
}
