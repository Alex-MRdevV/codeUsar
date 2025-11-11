import { createClient } from "@/lib/drizzle/clients/clients";
import { sheetSchema } from "@/lib/schemas/files/validarNumeros";
import { getDb } from "@/utils/db";
import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";
import XLSX from "xlsx";

export const POST: APIRoute = async ({ request, locals }) => {
	const { env } = locals.runtime;

	if (!env.DB) {
		return res(
			{
				message: "La variable de entorno DB no está definida",
			},
			{
				status: 401,
			}
		);
	}

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
		const sheetName = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[sheetName];
		const jsonData = XLSX.utils.sheet_to_json(worksheet);

		const {
			success,
			data: validatedData,
			error,
		} = sheetSchema.safeParse(jsonData);

		if (!success) {
			return res(
				{
					message: "Datos del archivo inválidos",
					error: error.message,
				},
				{
					status: 400,
				}
			);
		}

		const db = getDb(env.DB);
		const insertClientStmt = createClient(db);

		// Insertar cada cliente usando prepared statement
		for (const phone of validatedData) {
			await insertClientStmt.execute({
				id: crypto.randomUUID(),
				numeroCliente: phone.Cliente,
				nombre: phone.Nombre,
				telefono: phone.Telefono,
				documento: phone.Documento,
				createdAt: new Date(),
			});
		}

		return res(
			{
				message: "Se han agregado correctamente los datos.",
				data: {
					count: validatedData.length,
				},
			},
			{
				status: 201,
			}
		);
	} catch (error) {
		return res(
			{
				message: "Error al procesar el archivo",
				error: (error as Error).message,
			},
			{
				status: 500,
			}
		);
	}
};
