import * as v from "valibot";

export const CreateInterviewerSchema = v.object({
	name: v.pipe(
		v.string("El nombre debe ser un texto"),
		v.trim(),
		v.minLength(1, "El nombre es requerido"),
		v.maxLength(100, "El nombre no puede exceder 100 caracteres")
	),
	email: v.pipe(
		v.string("El email debe ser un texto"),
		v.trim(),
		v.toLowerCase(),
		v.email("Debe ser un email válido"),
		v.maxLength(100, "El email no puede exceder 100 caracteres")
	),
});

export const UpdateInterviewerSchema = v.object({
	...v.partial(CreateInterviewerSchema).entries,
	id: v.pipe(
		v.number("El ID debe ser un número"),
		v.integer("El ID debe ser un número entero"),
		v.minValue(1, "El ID debe ser mayor a 0")
	),
});

// Tipos TypeScript inferidos de los esquemas
export type CreateInterviewerInput = v.InferInput<
	typeof CreateInterviewerSchema
>;

export type UpdateInterviewerInput = v.InferInput<
	typeof UpdateInterviewerSchema
>;
