import type { ExcelRow } from "@/utils/types/messages";

export function validateRow(row: unknown): ExcelRow | null {
	if (!row || typeof row !== "object") {
		return null;
	}

	const validRow = row as Record<string, unknown>;

	// Buscar nombre (flexible con diferentes variaciones)
	const nombre = validRow.Nombre || validRow.nombre || validRow.NOMBRE;

	// Buscar teléfono (flexible con diferentes variaciones)
	const celular =
		validRow.Celular ||
		validRow.celular ||
		validRow.CELULAR ||
		validRow.Telefono ||
		validRow.telefono ||
		validRow.TELEFONO ||
		validRow.phoneNumber;

	if (!nombre || !celular) {
		return null;
	}

	// Limpiar el número de teléfono (remover espacios, guiones, etc.)
	let celularLimpio = String(celular).trim().replace(/[\s-]/g, "");

	// Si el número es 0, es inválido
	if (celularLimpio === "0" || celularLimpio === "") {
		return null;
	}

	// Filtrar números que comienzan con "60" (teléfonos fijos en Colombia)
	if (celularLimpio.startsWith("60")) {
		return null;
	}

	// Si tiene 11 dígitos, eliminar el primero (generalmente el código de país)
	if (celularLimpio.length === 11) {
		celularLimpio = celularLimpio.substring(1);
	}

	// Validar que tenga 10 dígitos después de la limpieza
	if (celularLimpio.length !== 10) {
		return null;
	}

	return {
		Nombre: String(nombre).trim(),
		Celular: celularLimpio,
	};
}
