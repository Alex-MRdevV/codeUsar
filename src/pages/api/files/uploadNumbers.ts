import { Clients } from "@/db/schema/clients";
import { sheetSchema } from "@/lib/schemas/files/validarNumeros";
import { getDb } from "@/utils/db";
import { res } from "@/utils/responseAstro";
import { uuid } from "@/utils/uuid";
import type { APIRoute } from "astro";
import XLSX from "xlsx";

export const POST: APIRoute = async ({ request, locals }) => {
	const data = await request.formData();
	const file = data.get("file") as File;
	const db = getDb(locals.runtime.env.DB);

	if (!file) {
		return res(
			{
				error: "No se ha cargado ningún archivo",
			},
			{
				status: 400,
			}
		);
	}

	try {
		const buffer = await file.arrayBuffer();
		const workbook = XLSX.read(buffer, { type: "buffer" });
		const sheetName = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[sheetName];
		const jsonData = XLSX.utils.sheet_to_json(worksheet);

		const {
			success,
			data: validatedData,
			error,
		} = sheetSchema.safeParse(jsonData);
		if (!success) return res(error.message, { status: 400 });

		// Mapear los datos para que coincidan con el esquema de la tabla
		const dataClients = validatedData.map((phone) => ({
			id: uuid.uuid,
			numeroCliente: phone.Cliente,
			nombre: phone.Nombre,
			telefono: phone.Telefono,
			documento: phone.Documento,
		}));

		await db.insert(Clients).values(dataClients);

		return res(
			{
				message: "Se han agregado correctamente los datos.",
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		return res(
			{
				error: "El archivo no es válido",
			},
			{
				status: 400,
			}
		);
	}
};
