import { validateAndFilterData } from "@/lib/schemas/files/validateData";
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
			idCliente: row["idCliente"] ?? "",
			nameEstablecimiento: row["\nNOMBRE ESTABLECIMIENTO"] ?? "",
			phoneNumber: row["PHONE MOBILE"] ?? "0",
			status: row["STATUS"] ?? "",
			idClienteConfirmar: row["ID CLIENTE CONFIRMAR"] ?? "",
			horaInicial: row["HORA INICIAL"] ?? "",
			horaFinal: row["HORA FINAL"] ?? "",
			idClienteVerificar: row["ID CLIENTE VERIFICAR"] ?? "",
			codeRechazo: row["CODE RECHAZO"] ?? "",
			phoneNumberConfirmar: row["PHONE MOBILE CONFIRMAR"] ?? "0",
			fechaPref: row["FECHA PREFE"] ?? "",
		}));
		const { validRows, byStatus, grouped, invalidRows, summary } =
			validateAndFilterData(normalizedData);

		return res(
			{
				message: "Archivo cargado correctamente",
				grouped: grouped,
				dataPorStatus: byStatus,
				dataValida: validRows,
				dataInvalida: invalidRows,
				summary: summary,
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
