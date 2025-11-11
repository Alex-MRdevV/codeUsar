import { getWhatsAppConfigByActiveUser } from "@/lib/drizzle/config/config";
import { getDb } from "@/utils/db";
import { res } from "@/utils/responseAstro";
import { type APIRoute } from "astro";

export const GET: APIRoute = async ({ locals }) => {
	try {
		const db = getDb(locals.runtime.env.DB);

		// Ejecuta la consulta
		const results = await getWhatsAppConfigByActiveUser(db).execute();

		// Normaliza los datos: agrupa cada usuario con sus teléfonos
		const formatted = results.map(({ config, user }) => ({
			userId: user.id,
			nombre: user.nombre,
			rol: user.rol,
			telefonos: {
				production: {
					id: config.productionPhoneId,
					numero: config.productionPhoneNumber,
					nombre: config.productionPhoneName,
				},
				preview: config.previewPhoneNumber
					? {
							id: config.previewPhoneId,
							numero: config.previewPhoneNumber,
							nombre: config.previewPhoneName,
					  }
					: null,
				development: config.developmentPhoneNumber
					? {
							id: config.developmentPhoneId,
							numero: config.developmentPhoneNumber,
							nombre: config.developmentPhoneName,
					  }
					: null,
			},
		}));

		return res(formatted, { status: 200 });
	} catch (error) {
		return res("Error interno del servidor", { status: 500 });
	}
};
