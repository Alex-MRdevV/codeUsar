import * as v from "valibot";

export const CashlessEnum = v.picklist(["Si", "No"], "Debe ser 'Si' o 'No'");

export const CreateClientSchema = v.object({
	id: v.pipe(
		v.string("El ID debe ser un texto"),
		v.trim(),
		v.minLength(1, "El ID es requerido"),
		v.maxLength(100, "El ID no puede exceder 100 caracteres")
	),
	phone: v.pipe(
		v.string("El teléfono debe ser un texto"),
		v.trim(),
		v.length(10, "El teléfono debe tener exactamente 10 dígitos"),
		v.regex(/^[0-9]+$/, "El teléfono solo debe contener números")
	),
	document: v.pipe(
		v.string("El documento debe ser un texto"),
		v.trim(),
		v.minLength(1, "El documento es requerido"),
		v.maxLength(20, "El documento no puede exceder 20 caracteres")
	),
	name: v.pipe(
		v.string("El nombre debe ser un texto"),
		v.trim(),
		v.minLength(1, "El nombre es requerido"),
		v.maxLength(100, "El nombre no puede exceder 100 caracteres")
	),
	cashless: v.optional(CashlessEnum, "No"),
});

export const UpdateClientSchema = v.object({
	id: v.pipe(
		v.string("El ID debe ser un texto"),
		v.trim(),
		v.minLength(1, "El ID es requerido"),
		v.maxLength(100, "El ID no puede exceder 100 caracteres")
	),
	phone: v.optional(
		v.pipe(
			v.string("El teléfono debe ser un texto"),
			v.trim(),
			v.length(10, "El teléfono debe tener exactamente 10 dígitos"),
			v.regex(/^[0-9]+$/, "El teléfono solo debe contener números")
		)
	),
	document: v.optional(
		v.pipe(
			v.string("El documento debe ser un texto"),
			v.trim(),
			v.minLength(1, "El documento no puede estar vacío"),
			v.maxLength(20, "El documento no puede exceder 20 caracteres")
		)
	),
	name: v.optional(
		v.pipe(
			v.string("El nombre debe ser un texto"),
			v.trim(),
			v.minLength(1, "El nombre no puede estar vacío"),
			v.maxLength(100, "El nombre no puede exceder 100 caracteres")
		)
	),
	cashless: v.optional(CashlessEnum),
});

export const ClientSchema = v.object({
	id: v.string(),
	phone: v.string(),
	document: v.string(),
	name: v.string(),
	cashless: CashlessEnum,
});

// Tipos TypeScript inferidos de los esquemas
export type CreateClientInput = v.InferInput<typeof CreateClientSchema>;
export type CreateClientOutput = v.InferOutput<typeof CreateClientSchema>;

export type UpdateClientInput = v.InferInput<typeof UpdateClientSchema>;
export type UpdateClientOutput = v.InferOutput<typeof UpdateClientSchema>;

export type Client = v.InferOutput<typeof ClientSchema>;
export type Cashless = v.InferOutput<typeof CashlessEnum>;

// Esquema para validar solo el ID (útil para operaciones de eliminación o búsqueda)
export const ClientIdSchema = v.pipe(
	v.string("El ID debe ser un texto"),
	v.trim(),
	v.minLength(1, "El ID es requerido"),
	v.maxLength(100, "El ID no puede exceder 100 caracteres")
);

export type ClientId = v.InferOutput<typeof ClientIdSchema>;
