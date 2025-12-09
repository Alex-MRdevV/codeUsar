import { roles } from "@/utils/types/user";
import * as v from "valibot";

export const loginSchema = v.object({
	email: v.pipe(
		v.string("El correo debe ser un tipo texto"),
		v.nonEmpty("No puede estar vació"),
		v.email("Debe ser un correo valido")
	),
	password: v.pipe(
		v.string("Debe ser un tipo string"),
		v.nonEmpty("No puede estar vació"),
		v.minLength(8, "Debe tener como mínimo 8 caracteres"),
		v.maxLength(40, "No puede tener más de 40 caracteres"),
		v.regex(
			/(?=(?:.*[A-Z]){1})(?=(?:.*[a-z]){1})(?=(?:.*[@$?¡\-_]){1})/,
			"La contraseña debe contener letras mayúsculas, minúsculas, números y caracteres especiales (@,_,$,etc)"
		)
	),
	role: v.picklist(roles, "Seleccione un rol válido."),
});

export type LoginInput = v.InferOutput<typeof loginSchema>;
