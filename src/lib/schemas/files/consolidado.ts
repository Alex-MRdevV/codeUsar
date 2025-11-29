import {
	estadoPedidoSchema,
	idClienteSchema,
	phoneSchema,
} from "@/lib/schemas/files/general";
import * as v from "valibot";

export const uploadDataConsolidada = v.looseObject({
	idCliente: idClienteSchema,
	nameEstablecimiento: v.optional(
		v.pipe(
			v.string(),
			v.transform((val) => val.trim())
		)
	),
	phoneNumber: phoneSchema,
	status: estadoPedidoSchema,
	idClienteConfirmar: idClienteSchema,
	horaInicial: v.pipe(
		v.union([v.string(), v.number()]),
		v.transform((value) => String(value).trim()),
		v.minLength(1, "La hora inicial no puede estar vacío")
	),
	horaFinal: v.pipe(
		v.union([v.string(), v.number()]),
		v.transform((value) => String(value).trim()),
		v.minLength(1, "La hora final no puede estar vacío")
	),
});

export type dataConsolidada = v.InferOutput<typeof uploadDataConsolidada>;

export const uploadDataConsped = v.looseObject({
	idCliente: v.union([idClienteSchema, v.literal("")]),
	codeRechazo: v.optional(
		v.pipe(
			v.string(),
			v.transform((val) => val.trim())
		)
	),
	phoneNumber: v.optional(v.union([phoneSchema, v.literal("0")])),
	fechaPref: v.optional(
		v.pipe(
			v.string(),
			v.regex(
				/^(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/\d{4}$/, // MM/DD/YYYY
				"La fecha debe tener el formato MM/DD/YYYY"
			)
		),
		""
	),
});
