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
		const workbook = XLSX.read(buffer, { type: "buffer" });
		const sheetName = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[sheetName];
		const jsonData = XLSX.utils.sheet_to_json(worksheet);

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
*/
