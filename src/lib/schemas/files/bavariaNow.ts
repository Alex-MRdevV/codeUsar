import {
	cashlessSchema,
	idClienteSchema,
	numberPedidoSchema,
} from "@/lib/schemas/client/general";
import * as v from "valibot";

export const uploadDataBavariaNow = v.looseObject({
	Cliente: idClienteSchema,
	"No ped Cliente": numberPedidoSchema,
	Material: v.pipe(
		v.string("Debe ser una cadena de texto"),
		v.transform((val) => val.trim())
	),
	"Cod Rechazo": v.optional(
		v.pipe(
			v.string("Debe ser una cadena de texto"),
			v.transform((val) => val.trim())
		)
	),
	"Fecha pref": v.optional(
		v.pipe(
			v.string(),
			v.regex(
				/^(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/\d{4}$/, // MM/DD/YYYY
				"La fecha debe tener el formato MM/DD/YYYY"
			)
		),
		""
	),
	Cajas: v.pipe(v.number("Debe ser un numero")),
	"Nombre establecimiento": v.pipe(
		v.string("El nombre debe ser un texto"),
		v.trim(),
		v.minLength(1, "El nombre es requerido"),
		v.maxLength(100, "El nombre no puede exceder 100 caracteres")
	),
	Cashless: cashlessSchema,
});

export type dataConsolidadaBavariaNow = v.InferOutput<
	typeof uploadDataBavariaNow
>;
