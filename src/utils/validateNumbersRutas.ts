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

	if (!nombre || !celular || !horaInicial || !horaFinal) return null;

	// Limpiar el número de teléfono (remover espacios, guiones, etc.)
	let celularLimpio = String(celular).trim().replace(/[\s-]/g, "");

	// Si el número es 0, es inválido
	if (celularLimpio === "0" || celularLimpio === "") return null;

	if (celularLimpio.length === 11) {
		celularLimpio = celularLimpio.substring(1);
	}

	// Filtrar números fijos colombianos (comienzan con 60)
	// WhatsApp solo funciona con números móviles
	if (celularLimpio.startsWith("60")) return null;

	// Validar que sea un número móvil colombiano válido (10 dígitos, empieza con 3)
	if (celularLimpio.length !== 10 || !celularLimpio.startsWith("3"))
		return null;

	//Convertir horas de formato decimal a formato HH:MM
	const horaInicialFormateada = parseHora(horaInicial);
	const horaFinalFormateada = parseHora(horaFinal);

	// Validar que las horas se hayan convertido correctamente
	if (!horaInicialFormateada || !horaFinalFormateada) return null;

	return {
		Nombre: String(nombre).trim(),
		Celular: celularLimpio,
		"Hora inicial": horaInicialFormateada,
		"Hora Final": horaFinalFormateada,
	};
}

function parseHora(value: unknown): string {
  if (value === null || value === undefined) return "";

  // Convertir a texto limpio
  let raw = String(value).trim();

  // 1. Intentar convertir a número decimal (formato Excel)
  const asNumber = Number(raw);
  const isDecimal = !isNaN(asNumber) && asNumber > 0 && asNumber < 1;

  if (isDecimal) {
    // Si es decimal tipo Excel (0.333, 0.5, etc.) -> convertir
    return decimalToHora24ConAMPM(asNumber);
  }

  // 2. Si no es decimal, puede ser "8:36" o "08:36"
  if (/^\d{1,2}:\d{1,2}$/.test(raw)) {
    let [h, m] = raw.split(":");
    const hours = parseInt(h);
    const periodo = hours >= 12 ? "PM" : "AM";
    const hFormatted = hours.toString().padStart(2, "0");
    const mFormatted = m.padStart(2, "0");
    return `${hFormatted}:${mFormatted} ${periodo}`;
  }

  // 3. Si es un número entero (como 8 o 14), asumimos que son horas
  const asInteger = parseInt(raw);
  if (!isNaN(asInteger) && asInteger >= 0 && asInteger < 24) {
    const periodo = asInteger >= 12 ? "PM" : "AM";
    return `${asInteger.toString().padStart(2, "0")}:00 ${periodo}`;
  }

  // Último recurso: vacío si no se puede parsear
  return "";
}

function decimalToHora24ConAMPM(decimal: number): string {
  if (typeof decimal !== "number" || isNaN(decimal)) return "";

  const totalMinutes = Math.round(decimal * 24 * 60);
  let hours = Math.floor(totalMinutes / 60);
  let minutes = totalMinutes % 60;

  const periodo = hours >= 12 ? "PM" : "AM";

  // Asegurar 2 dígitos (mantener formato 24h)
  const h = hours.toString().padStart(2, "0");
  const m = minutes.toString().padStart(2, "0");

  return `${h}:${m} ${periodo}`;
}
