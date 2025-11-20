import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";
import * as XLSX from "xlsx";

export const processEta = async (file: File) => {
	try {
		const arrayBuffer = await file.arrayBuffer();
		const workbook = XLSX.read(arrayBuffer, {
			type: "array",
		});
		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];
		const jsonData = XLSX.utils.sheet_to_json(sheet, {
			header: 0,
			raw: false,
		});

		
	} catch (error) {}
};
