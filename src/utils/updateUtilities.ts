import * as XLSX from "xlsx";

export function buildUpdateSet<T extends Record<string, any>>(data: T) {
	const entries = Object.entries(data).filter(([_, v]) => v !== undefined);
	return Object.fromEntries(entries) as Partial<T>;
}

// Normaliza nombres de hoja para compararlos
const normalize = (str: string) =>
	str
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // quita acentos
		.replace(/[^a-z0-9]/g, ""); // quita espacios/símbolos

export const getSheetByName = (workbook: XLSX.WorkBook, targetName: string) => {
	const targetNorm = normalize(targetName);

	// 1) coincidencia exacta
	const exactMatch = workbook.SheetNames.find(
		(n) => normalize(n) === targetNorm
	);

	if (exactMatch) return workbook.Sheets[exactMatch];

	// 2) coincidencia parcial (si exacta no existe)
	const partialMatch = workbook.SheetNames.find((n) =>
		normalize(n).includes(targetNorm)
	);

	if (partialMatch) return workbook.Sheets[partialMatch];

	// 3) si nada coincide → error
	throw new Error(
		`No se encontró ninguna hoja que coincida con "${targetName}".`
	);
};
