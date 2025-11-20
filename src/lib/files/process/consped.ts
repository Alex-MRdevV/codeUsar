import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";
import * as XLSX from "xlsx";
import { getSheetByName } from "@/utils/updateUtilities";

export const processConsped = async (file: File) => {
	try {
		const arrayBuffer = await file.arrayBuffer();
		const workbook = XLSX.read(arrayBuffer, {
			type: "array",
		});
		const sheet = getSheetByName(workbook, "datos");
		const jsonData = XLSX.utils.sheet_to_json(sheet, {
			header: 0,
			raw: false,
		});

		
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
