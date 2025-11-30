import { validateAndFilterData } from "@/lib/schemas/files/validateBavariaNow";
import { res } from "@/utils/responseAstro";
import { getSheetByName } from "@/utils/utilities";
import type { APIRoute } from "astro";
import * as XLSX from "xlsx";

export const POST: APIRoute = async ({ request }) => {
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
		const sheet = getSheetByName(workbook, "Plantilla mensajeria");
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

		const normalizedData = filteredData.map((row: any) => ({
			idCliente: row["Cliente"] ?? "",
			numeroPedido: row["No ped Cliente"] ?? "",
			producto: row["Material"] ?? "",
			codRechazo: row["Cod Rechazo"] ?? "0",
			fecha: row["Fecha pref"] ?? "",
			cajas: row["Cajas"] ?? "",
			name: row["Nombre establecimiento"] ?? "",
			cashless: row["Cashless"] ?? "",
		}));
		const { invalidRows, summary, groupedOrders } =
			validateAndFilterData(normalizedData);

		return res(
			{
				message: "Archivo cargado correctamente",
				groupedOrders: groupedOrders,
				summary: summary,
				dataInvalida: invalidRows,
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		return res(
			{
				message: "Ha ocurrido un error inesperado",
			},
			{
				status: 500,
			}
		);
	}
};
