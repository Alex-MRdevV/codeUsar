import { z } from "zod";
import { roles } from "@/utils/types/user";

// Esquema base sin refinamiento
const baseSchema = z.object({
	email: z.email({
		message: "Debe ser un correo valido",
	}),
	nombre: z
		.string({
			error: "El nombre no puede estar vacío",
			message: "El nombre no puede ser null",
		})
		.min(1, {
			message: "El nombre no puede estar vacío",
		}),
	rol: z.enum(roles, {
		message: "El rol debe ser una de las opciones",
	}),
	password: z
		.string({
			error: "La contraseña no puede estar vacío",
			message: "La contraseña no puede ser null",
		})
		.min(8, {
			message: "La contraseña debe tener al menos 8 caracteres",
		})
		.max(40, {
			message: "La contraseña no puede tener más de 40 caracteres",
		})
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
			message:
				"La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial !@#$%^&*",
		}),
	confirmPassword: z
		.string({
			error: "Confirma tu contraseña",
		})
		.min(8, {
			message: "La contraseña debe tener al menos 8 caracteres",
		})
		.max(40, {
			message: "La contraseña no puede tener más de 40 caracteres",
		})
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
			message:
				"La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial !@#$%^&*",
		}),
});

// Aplica el refinamiento después de crear el esquema base
export const registerSchema = baseSchema.refine(
	(data) => data.password === data.confirmPassword,
	{
		message: "Las contraseñas deben coincidir",
		path: ["confirmPassword"],
	}
);

export type FormValues = z.infer<typeof registerSchema>;

// Crea el esquema de actualización usando .partial() en el esquema base
export const updateSchema = baseSchema.partial().extend({
	id: z.string({
		message: "El id debe ser un texto",
	}),
});

export const removeSchema = z.object({
	id: z.string({
		message: "El id debe ser un texto",
	}),
});
