import { addClientMensajes } from "@/lib/drizzle/data";
import { res } from "@/utils/responseAstro";
import { validateRow } from "@/utils/validateNumbers";
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
		const sheetName = workbook.SheetNames[2];

		// Verificar que la hoja exista
		if (!workbook.Sheets[sheetName]) {
			return res(
				{ message: `No se encontró la hoja correspondiente` },
				{ status: 400 }
			);
		}

		const worksheet = workbook.Sheets[sheetName];
		const jsonData = XLSX.utils.sheet_to_json(worksheet);
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
