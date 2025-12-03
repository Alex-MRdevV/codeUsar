import type { ExcelRowRutas } from "@/utils/types/messages";

export function validateRow(row: unknown): ExcelRowRutas | null {
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

	// Buscar hora inicial (flexible con diferentes variaciones)
	const horaInicial =
		validRow["Hora inicial"] ||
		validRow["Hora Inicial"] ||
		validRow["HORA INICIAL"] ||
		validRow["hora inicial"] ||
		validRow["hora_inicial"] ||
		validRow["horaInicial"] ||
		validRow["HoraInicial"] ||
		validRow["Inicio"] ||
		validRow["inicio"] ||
		validRow["INICIO"] ||
		validRow["Start"] ||
		validRow["start"] ||
		validRow["START"];

	// Buscar hora final (flexible con diferentes variaciones)
	const horaFinal =
		validRow["Hora Final"] ||
		validRow["Hora final"] ||
		validRow["HORA FINAL"] ||
		validRow["hora final"] ||
		validRow["hora_final"] ||
		validRow["horaFinal"] ||
		validRow["HoraFinal"] ||
		validRow["Fin"] ||
		validRow["fin"] ||
		validRow["FIN"] ||
		validRow["End"] ||
		validRow["end"] ||
		validRow["END"] ||
		validRow["Final"] ||
		validRow["final"] ||
		validRow["FINAL"];

	// ERROR CORREGIDO: Cambiar "horaFinal" por "!horaFinal"
	if (!nombre || !celular || !horaInicial || !horaFinal) {
		return null;
	}

	// Limpiar el número de teléfono (remover espacios, guiones, etc.)
	let celularLimpio = String(celular).trim().replace(/[\s-]/g, "");

	// Si el número es 0, es inválido
	if (celularLimpio === "0" || celularLimpio === "") {
		return null;
	}

	// Si tiene 11 dígitos, eliminar el primero (generalmente el código de país)
	if (celularLimpio.length === 11) {
		celularLimpio = celularLimpio.substring(1);
	}

	// Filtrar números fijos colombianos (comienzan con 60)
	// WhatsApp solo funciona con números móviles
	if (celularLimpio.startsWith("60")) {
		return null;
	}

	// Validar que sea un número móvil colombiano válido (10 dígitos, empieza con 3)
	if (celularLimpio.length !== 10 || !celularLimpio.startsWith("3")) {
		return null;
	}

	return {
		Nombre: String(nombre).trim(),
		Celular: celularLimpio,
		"Hora inicial": String(horaInicial).trim(),
		"Hora Final": String(horaFinal).trim(),
	};
}
