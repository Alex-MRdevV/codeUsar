import { addClientMensajes } from "@/lib/drizzle/data";
import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";
import * as XLSX from "xlsx";

export const POST: APIRoute = async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get("file") as File;
	const status = formData.get("status") as string;

	if (!file) {
		return res({ message: "No se ha cargado ningún archivo" }, { status: 400 });
	}

	if (!status) {
		return res(
			{ message: "No se ha proporcionado el status" },
			{ status: 400 }
		);
	}

	try {
		const buffer = await file.arrayBuffer();
		const workbook = XLSX.read(buffer, { type: "buffer" });

		// Mapeo de status a índice de hoja (posición)
		const sheetIndexMap: Record<string, number> = {
			pedidos_no_planeados: 1, // Segunda hoja (índice 1)
			confirmar_pedido: 2, // Segunda hoja (índice 1)
		};

		// Obtener el índice de la hoja según el status
		const sheetIndex = sheetIndexMap[status];

		if (sheetIndex === undefined) {
			return res(
				{
					message: `No se encontró una hoja configurada para el status: ${status}`,
				},
				{ status: 400 }
			);
		}

		// Obtener el nombre de la hoja por su índice
		const sheetName = workbook.SheetNames[sheetIndex];

		// Verificar que la hoja exista
		if (!sheetName || !workbook.Sheets[sheetName]) {
			return res(
				{
					message: `La hoja en la posición ${sheetIndex} no existe en el archivo`,
				},
				{ status: 400 }
			);
		}

		const sheet = workbook.Sheets[sheetName];
		const jsonData = XLSX.utils.sheet_to_json(sheet);

		interface ExcelRow {
			Nombre: string;
			Celular: string;
			[key: string]: unknown;
		}

		// Función para validar y normalizar una fila
		function validateRow(row: unknown): ExcelRow | null {
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

		const savedRecords = [];
		const errors = [];

		for (let i = 0; i < jsonData.length; i++) {
			const row = jsonData[i];
			const validatedRow = validateRow(row);

			if (!validatedRow) {
				errors.push(`Fila ${i + 2}: Datos inválidos o incompletos`);
				continue;
			}

			try {
				const record = await addClientMensajes({
					nombre: validatedRow.Nombre,
					phoneNumber: validatedRow.Celular,
					tipoMensaje: status,
				});

				savedRecords.push(record[0]);
			} catch (error) {
				errors.push(
					`Fila ${i + 2}: Error al guardar - ${
						error instanceof Error ? error.message : "Error desconocido"
					}`
				);
			}
		}

		return res(
			{
				message: "Procesamiento completado",
				hojaProcesada: sheetName,
				posicionHoja: sheetIndex,
				data: savedRecords,
				total: jsonData.length,
				guardados: savedRecords.length,
				errores: errors.length > 0 ? errors : undefined,
			},
			{ status: savedRecords.length > 0 ? 200 : 400 }
		);
	} catch (error) {
		return res(
			{
				message: "Ha ocurrido un error inesperado",
				error: error instanceof Error ? error.message : "Error desconocido",
			},
			{ status: 500 }
		);
	}
};
