import { roles } from "@/utils/types/message";
import { z } from "zod";

export const loginSchema = z.object({
	email: z
		.email({
			message: "Debe ser un correo valido",
		})
		.min(6),
	password: z
		.string()
		.min(6, {
			message: "La contraseña no es valida",
		})
		.max(35, {
			message: "La contraseña supera el máximo de 35 caracteres",
		})
		.regex(
			new RegExp(/(?=(?:.*[A-Z]){1})(?=(?:.*[a-z]){1})(?=(?:.*[@$?¡\-_]){1})/),
			{
				//expresiones regulares
				//(?=(?:.*[A-Z]){1}) --> valida que hay mínimo una letra mayúscula
				//(?=(?:.*[a-z]){1}) --> valida que hay mínimo una letra minúscula
				//(?=(?:.*[@$?¡\-_]){1}) --> valida que hay mínimo un carácter especial
				message:
					"La contraseña debe contener letras mayúsculas, minúsculas, números y caracteres especiales (@,_,$,etc)",
			}
		),
	rol: z.enum(roles, {
		error: () => ({
			message: "Seleccione un rol valido.",
		}),
	}),
});
