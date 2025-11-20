import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { validateAndFilterPedidosPorEstado } from "@/lib/schemas/files/validarRutero";

export const POST: APIRoute = async ({ request, locals }) => {
	const { env } = locals.runtime;
	const data = await request.formData();
	const file = data.get("file") as File;

	if (!file) {
		return res({ message: "No se ha cargado ningún archivo" }, { status: 400 });
	}

	try {
		const arrayBuffer = await file.arrayBuffer();
		const workbook = XLSX.read(arrayBuffer, {
			type: "array",
		});

		// Leer la segunda hoja (índice 1)
		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];

		// OBTENER LOS HEADERS DETECTADOS
		const rawHeaders = XLSX.utils.sheet_to_json(sheet, {
			header: 1, // Obtener como array de arrays
			defval: "",
			raw: false,
		});

		// La primera fila contiene los headers
		const detectedHeaders = rawHeaders[0] as string[];

		// Convertir a JSON con encabezados
		const jsonData = XLSX.utils.sheet_to_json(sheet, {
			header: 0,
			defval: "",
			raw: false,
		});

		// Filtrar filas vacías o que parezcan encabezados
		const filteredData = jsonData.filter((row: any) => {
			const hasActualData = Object.values(row).some(
				(val) =>
					val && String(val).trim() !== "" && !String(val).includes("Solic")
			);
			return hasActualData;
		});

		// Validar y filtrar los datos
		const resultado = validateAndFilterPedidosPorEstado(filteredData);

		// Si hay errores, devolver información detallada + headers
		if (resultado.invalidRows.length > 0) {
			return res(
				{
					message: "Se encontraron errores en el archivo",
					headers: detectedHeaders, // ✅ Headers detectados
					headerCount: detectedHeaders.length,
					summary: resultado.summary,
					validRows: resultado.validRows,
					invalidRows: resultado.invalidRows.slice(0, 10),
					grouped: resultado.grouped,
					// Muestra de la primera fila procesada para debug
					firstRowSample: filteredData[0] || null,
				},
				{ status: 207 }
			);
		}

		// Si todo es válido
		return res(
			{
				message: "Archivo procesado correctamente",
				summary: resultado.summary,
				grouped: resultado.grouped,
				data: resultado.validRows,
				// Muestra de la primera fila procesada para debug
				firstRowSample: filteredData[0] || null,
			},
			{ status: 200 }
		);
	} catch (error) {
		return res(
			{
				message: "Error al procesar el archivo",
				error: (error as Error).message,
			},
			{ status: 500 }
		);
	}
};

/*
export const POST: APIRoute = async ({ request, locals }) => {
	const { env } = locals.runtime;
	const data = await request.formData();
	const file = data.get("file") as File;

	if (!file) {
		return res({ message: "No se ha cargado ningún archivo" }, { status: 400 });
	}

	try {
		const arrayBuffer = await file.arrayBuffer();
		const workbook = XLSX.read(arrayBuffer, {
			type: "array",
			cellStyles: true, // Habilita estilos
			cellNF: true, // Habilita formatos de número
		});

		const sheetName = workbook.SheetNames[1];
		const sheet = workbook.Sheets[sheetName];

		// Convertir a JSON (valores)
		const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

		// Extraer colores de fondo - VERSIÓN CORREGIDA
		const colors: Record<string, string | null> = {};

		for (const cellAddr in sheet) {
			if (cellAddr.startsWith("!")) continue;

			const cell = sheet[cellAddr];
			let color = null;

			// Verificar si existe estilo y fill
			if (cell.s && cell.s.fill) {
				const fill = cell.s.fill;

				// Priorizar fgColor (color de frente) que suele ser el color de fondo en Excel
				if (fill.fgColor && fill.fgColor.rgb) {
					color = fill.fgColor.rgb;
				}
				// Luego bgColor (color de fondo)
				else if (fill.bgColor && fill.bgColor.rgb) {
					color = fill.bgColor.rgb;
				}
				// Para fills con patrón
				else if (fill.patternType && fill.fgColor && fill.fgColor.rgb) {
					color = fill.fgColor.rgb;
				}
			}

			colors[cellAddr] = color;
		}

		return res(
			{
				message: "Archivo leído correctamente",
				data: jsonData,
				colors,
			},
			{ status: 200 }
		);
	} catch (error) {
		return res(
			{
				message: "Error al procesar el archivo",
				error: (error as Error).message,
			},
			{ status: 500 }
		);
	}
};
/*
import { validateAndFilterNumbers } from "@/lib/utils";
import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";
import * as XLSX from "xlsx";

export const POST: APIRoute = async ({ request, locals }) => {
	const { env } = locals.runtime;

	if (!env.DB || !env.KV) {
		return res(
			{
				message: "Variables de entorno no configuradas",
			},
			{ status: 401 }
		);
	}

	const data = await request.formData();
	const file = data.get("file") as File;

	if (!file) {
		return res(
			{
				message: "No se ha cargado ningún archivo",
			},
			{
				status: 400,
			}
		);
	}

	try {
		const buffer = await file.arrayBuffer();
		const arrayBuffer = await file.arrayBuffer();
		const nodeBuffer = Buffer.from(arrayBuffer);

		const workbook3 = XLSX.read(nodeBuffer, {
			type: "buffer",
			cellStyles: true,
		});

		const workbook = XLSX.read(buffer, { type: "buffer" });
		const workbook2 = XLSX.readFile("archivo.xlsx", { cellStyles: true });
		const sheetName = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[sheetName];
		const jsonData = XLSX.utils.sheet_to_json(worksheet);

		return res(
			{ jsonData },
			{
				status: 200,
			}
		);
	} catch (error) {
		return res(
			{
				message: "Error al procesar el archivo",
				error: (error as Error).message,
			},
			{
				status: 500,
			}
		);
	}
};

/*
// Validar y filtrar las filas
		const { validRows, invalidRows } = validateAndFilterNumbers(jsonData);

		// Si no hay filas válidas, retornar error
		if (validRows.length === 0) {
			return res(
				{
					message: "No se encontraron Números válidos en el archivo",
					invalidRows: invalidRows.map(({ row, errors }) => ({
						fila: row,
						errores: errors,
					})),
				},
				{
					status: 400,
				}
			);
		}

		const dataToStore = {
			phones: validRows,
			timestamp: new Date().toISOString(),
			totalRecords: validRows.length,
		};

		await env.KV.put("phones", JSON.stringify(dataToStore), {
			expirationTtl: 3600, // 1 hora en segundos
		});

		return res(
			{
				message:
					invalidRows.length > 0
						? `Se agregaron ${validRows.length} registros. ${invalidRows.length} filas fueron omitidas por errores.`
						: "Se han agregado correctamente todos los datos.",
				data: {
					insertados: validRows.length,
					omitidos: invalidRows.length,
					...(invalidRows.length > 0 && {
						filasInvalidas: invalidRows.map(({ row, errors }) => ({
							fila: row,
							errores: errors,
						})),
					}),
				},
			},
			{
				status: 201,
			}
		);
*/
