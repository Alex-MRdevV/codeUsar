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
	id: v.pipe(
		v.number("El ID debe ser un número"),
		v.integer("El ID debe ser un número entero"),
		v.minValue(1, "El ID debe ser mayor a 0")
	),
	name: v.optional(
		v.pipe(
			v.string("El nombre debe ser un texto"),
			v.trim(),
			v.minLength(1, "El nombre no puede estar vacío"),
			v.maxLength(100, "El nombre no puede exceder 100 caracteres")
		)
	),
	email: v.optional(
		v.pipe(
			v.string("El email debe ser un texto"),
			v.trim(),
			v.toLowerCase(),
			v.email("Debe ser un email válido"),
			v.maxLength(100, "El email no puede exceder 100 caracteres")
		)
	),
});

export const InterviewerSchema = v.object({
	id: v.number(),
	name: v.string(),
	email: v.string(),
	created_at: v.nullable(v.date()),
});

// Tipos TypeScript inferidos de los esquemas
export type CreateInterviewerInput = v.InferInput<
	typeof CreateInterviewerSchema
>;
export type CreateInterviewerOutput = v.InferOutput<
	typeof CreateInterviewerSchema
>;

export type UpdateInterviewerInput = v.InferInput<
	typeof UpdateInterviewerSchema
>;
export type UpdateInterviewerOutput = v.InferOutput<
	typeof UpdateInterviewerSchema
>;

export type Interviewer = v.InferOutput<typeof InterviewerSchema>;

// Esquema para validar solo el ID (útil para operaciones de eliminación o búsqueda)
export const InterviewerIdSchema = v.pipe(
	v.number("El ID debe ser un número"),
	v.integer("El ID debe ser un número entero"),
	v.minValue(1, "El ID debe ser mayor a 0")
);

export type InterviewerId = v.InferOutput<typeof InterviewerIdSchema>;
