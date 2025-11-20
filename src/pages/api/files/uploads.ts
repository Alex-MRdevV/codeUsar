import { fileHandlers } from "@/lib/files/handlers";
import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
	const formData = await request.formData();
	const files = formData.getAll("files") as File[];

	if (!files.length)
		return res({ message: "No se ha cargado ningún archivo" }, { status: 400 });

	const results: any[] = [];
	for (const file of files) {
		const handler = fileHandlers[file.name];

		if (!handler) {
			results.push({
				name: file.name,
				error: "No existe un handler para este archivo",
			});
			continue;
		}

		try {
			const result = await handler(file);
			results.push({ name: file.name, result });
		} catch (error) {
			results.push({
				name: file.name,
				error: (error as Error).message,
			});
		}
	}
	return res(
		{ message: "Datos procesados correctamente", results },
		{ status: 200 }
	);
};
