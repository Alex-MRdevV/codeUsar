import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";
import * as XLSX from "xlsx";

export const POST: APIRoute = async ({ request, locals }) => {
	const { env } = locals.runtime;

	const data = await request.formData();
	const file = data.get("file") as File;

	if (!file) {
		return res({ message: "No se ha cargado ningún archivo" }, { status: 400 });
	}

	try {
		/** -------------------------------
		 * Leer archivo desde formulario
		 --------------------------------*/
		const arrayBuffer = await file.arrayBuffer();

		const workbook = XLSX.read(arrayBuffer, {
			type: "array", // <--- necesario para uploads
			cellStyles: true, // <--- habilita lectura de colores
		});

		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];
		console.log(sheet["A4"]);

		/** -------------------------------
		 * Convertir a JSON (solo valores)
		 --------------------------------*/
		const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

		/** -------------------------------
		 * Extraer colores celda por celda
		 --------------------------------*/
		const colors: Record<string, string | null> = {};

		for (const cellAddr in sheet) {
			if (cellAddr.startsWith("!")) continue; // ignorar metadatos

			const cell = sheet[cellAddr];
			const color = cell.s?.fill?.fgColor?.rgb ?? null;

			colors[cellAddr] = color;
		}
		//jsonData,
		/** -------------------------------
		 * Respuesta para inspección
		 --------------------------------*/
		return res(
			{
				message: "Archivo leído correctamente", // valores del Excel
				colors, // colores por celda
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
