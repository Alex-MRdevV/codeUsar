import { idClienteSchema, phoneSchema } from "@/lib/schemas/client/general";
import * as v from "valibot";

export const CashlessEnum = v.picklist(["Si", "No"], "Debe ser 'Si' o 'No'");

export const CreateClientSchema = v.object({
	id: idClienteSchema,
	phone: phoneSchema,
	name: v.pipe(
		v.string("El nombre debe ser un texto"),
		v.trim(),
		v.minLength(1, "El nombre es requerido"),
		v.maxLength(100, "El nombre no puede exceder 100 caracteres")
	),
	cashless: v.optional(CashlessEnum, "No"),
});

export const UpdateClientSchema = v.partial(CreateClientSchema, [
	"phone",
	"name",
	"cashless",
]);
