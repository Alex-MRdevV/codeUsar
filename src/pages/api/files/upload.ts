import { addClientMensajes } from "@/lib/drizzle/data";
import { processConsolidadoData } from "@/lib/schemas/files/validateConsolidado";
import { res } from "@/utils/responseAstro";
import type { dataUsar } from "@/utils/types/messages";
import { getSheetByName } from "@/utils/utilities";
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
		const sheet = getSheetByName(workbook, "Hoja 1");

		// Convertir la hoja a JSON
		const jsonData = XLSX.utils.sheet_to_json(sheet);

		interface ExcelRow {
			Nombre: string;
			Telefono: string;
			phoneNumber?: string;
			[key: string]: unknown; // Para otras columnas opcionales
		}

		// Función para validar y normalizar una fila
		function validateRow(row: unknown): ExcelRow | null {
			if (!row || typeof row !== "object") {
				return null;
			}

			const validRow = row as Record<string, unknown>;

			// Validar que tenga al menos nombre y teléfono
			const nombre = validRow.Nombre || validRow.nombre;
			const telefono =
				validRow.Telefono || validRow.telefono || validRow.phoneNumber;

			if (!nombre || !telefono) {
				return null;
			}

			return {
				Nombre: String(nombre).trim(),
				Telefono: String(telefono).trim(),
			};
		}

		// En tu código del POST:
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
					phoneNumber: validatedRow.Telefono,
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
