import * as v from "valibot";

// Esquema base sin refinamiento
const baseSchema = v.object({
	name: v.pipe(
		v.string("El nombre no puede ser null"),
		v.minLength(1, "El nombre no puede estar vacío")
	),
	email: v.pipe(
		v.string("El email debe ser un texto"),
		v.email("Debe ser un correo válido")
	),
	password: v.pipe(
		v.string("La contraseña no puede ser null"),
		v.minLength(8, "La contraseña debe tener al menos 8 caracteres"),
		v.maxLength(40, "La contraseña no puede tener más de 40 caracteres"),
		v.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
			"La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial !@#$%^&*"
		)
	),
	confirmPassword: v.pipe(
		v.string("Confirma tu contraseña"),
		v.minLength(8, "La contraseña debe tener al menos 8 caracteres"),
		v.maxLength(40, "La contraseña no puede tener más de 40 caracteres"),
		v.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
			"La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial !@#$%^&*"
		)
	),
});

// Aplica el refinamiento después de crear el esquema base
export const registerSchema = v.pipe(
	baseSchema,
	v.forward(
		v.partialCheck(
			[["password"], ["confirmPassword"]],
			(input) => input.password === input.confirmPassword,
			"Las contraseñas deben coincidir"
		),
		["confirmPassword"]
	)
);

export type FormValuesCreate = v.InferOutput<typeof registerSchema>;

// Esquema para regenerar token
export const regenerateTokenSchema = v.object({
	id: v.pipe(
		v.string("El id debe ser un texto"),
		v.uuid("ID de usuario inválido")
	),
	email: v.pipe(
		v.string("El email debe ser un texto"),
		v.email("Debe ser un correo válido")
	),
});

export type FormValuesRegenerateToken = v.InferOutput<
	typeof regenerateTokenSchema
>;
