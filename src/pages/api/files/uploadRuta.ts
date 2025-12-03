import { processConsolidadoData } from "@/lib/schemas/files/validateConsolidado";
import { res } from "@/utils/responseAstro";
import { getSheetByName } from "@/utils/utilities";
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
		const sheet = getSheetByName(workbook, "Plantilla mensajeria");

		const jsonData = XLSX.utils.sheet_to_json(sheet, {
			header: 0,
			raw: false,
		});

		// Filtro: filas vacías o que sean el encabezado
		const filteredData = jsonData.filter((row: any) =>
			Object.values(row).some(
				(val) =>
					val && String(val).trim() !== "" && !String(val).includes("Solic")
			)
		);

		// Normalización
		const normalizedData = filteredData.map((row: any) => ({
			idCliente: row["idCliente"] ?? "",
			nameEstablecimiento: row["nombreEstablecimiento"] ?? "",
			phoneNumber: row["phoneNumber"] ?? "0",
			Estado: row["Estado"] ?? "",
			clienteId: row["ClienteId"] ?? "",
			horaInicial: row["horaInicial"] ?? "",
			horaFinal: row["horaFinal"] ?? "",
		}));

		const { byStatus, summary } = processConsolidadoData(normalizedData);

		return res(
			{
				message: "Archivo cargado correctamente",
				dataPorStatus: byStatus,
				summary,
			},
			{ status: 200 }
		);
	} catch (error) {
		return res({ message: "Ha ocurrido un error inesperado" }, { status: 500 });
	}
};
