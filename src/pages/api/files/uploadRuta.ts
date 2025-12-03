import { addClienteEnRuta } from "@/lib/drizzle/data";
import { res } from "@/utils/responseAstro";
import { validateRow } from "@/utils/validateNumbersRutas";
import type { APIRoute } from "astro";
import * as XLSX from "xlsx";

export const POST: APIRoute = async ({ request }) => {
	const data = await request.formData();
	const file = data.get("file") as File;

	if (!file) {
		return res({ message: "No se ha cargado ningún archivo" }, { status: 400 });
	}

	try {
		const buffer = await file.arrayBuffer();
		const workbook = XLSX.read(buffer, { type: "buffer" });
		const sheetName = workbook.SheetNames[0];

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
				const record = await addClienteEnRuta({
					nameEstablecimiento: validatedRow.Nombre,
					phoneNumber: validatedRow.Celular,
					horaInicial: validatedRow["Hora inicial"],
					horaFinal: validatedRow["Hora Final"],
				});
				savedRecords.push(record);
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
				message: "Archivo cargado correctamente",
				hojaProcesada: sheetName,
				data: savedRecords,
				total: jsonData.length,
				guardados: savedRecords.length,
				errores: errors.length > 0 ? errors : undefined,
			},
			{ status: 200 }
		);
	} catch (error) {
		return res({ message: "Ha ocurrido un error inesperado" }, { status: 500 });
	}
};
