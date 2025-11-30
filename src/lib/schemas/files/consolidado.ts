import {
	estadoPedidoSchema,
	idClienteSchema,
	phoneSchema,
} from "@/lib/schemas/client/general";
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
	Estado: estadoPedidoSchema,
	clienteId: idClienteSchema,
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
