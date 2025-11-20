import { validateAndFilterPedidosPorEstado } from "@/lib/schemas/files/validarRutero";
import { res } from "@/utils/responseAstro";
import { getSheetByName } from "@/utils/updateUtilities";
import * as XLSX from "xlsx";

export const processRutero = async (file: File) => {
	try {
		const arrayBuffer = await file.arrayBuffer();
		const workbook = XLSX.read(arrayBuffer, { type: "array" });
		const sheet = getSheetByName(workbook, "datos");
		const jsonData = XLSX.utils.sheet_to_json(sheet, {
			header: 0,
			raw: false,
		});

		// Filtrar filas vacías o que parezcan encabezado
		const filteredData = jsonData.filter((row: any) =>
			Object.values(row).some(
				(val) =>
					val && String(val).trim() !== "" && !String(val).includes("Solic")
			)
		);
		const resultado = validateAndFilterPedidosPorEstado(filteredData);

		// Si hay errores, devolver ErrorResponse
		if (resultado.invalidRows.length > 0) {
			return res(
				{
					message: "Se encontraron errores en el archivo",
					invalidRows: resultado.invalidRows.map((row) => ({
						fila: row.row,
						errores: row.errors,
					})),
				},
				{ status: 207 }
			);
		}

		return res(
			{
				message: "Archivo procesado correctamente",
				data: {
					insertados: resultado.validRows.length,
					omitidos: 0,
					filasInvalidas: [],
				},
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
