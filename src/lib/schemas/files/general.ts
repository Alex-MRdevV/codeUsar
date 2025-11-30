import * as v from "valibot";

export const estadoPedidoSchema = v.pipe(
	v.string(),
	v.transform((val) => val.toUpperCase().trim()),
	v.picklist(
		["EN RUTA", "SEGUNDO VIAJE", "APLAZADO"],
		"El estado debe ser: EN RUTA, SEGUNDO VIAJE o APLAZADO"
	)
);

export const cashlessSchema = v.optional(
	v.pipe(
		v.string(),
		v.transform((val) => val.toUpperCase().trim()),
		v.picklist(["SI", "NO"], "Casless debe ser SI o NO")
	)
);

export const numberPedidoSchema = v.pipe(
	v.union([v.string(), v.number()]),
	v.transform((value) => String(value).trim()),
	v.minLength(1, "El número del pedido no puede estar vacío")
);

export const idClienteSchema = v.pipe(
	v.union([v.string(), v.number()]),
	v.transform((value) => String(value).trim()),
	v.minLength(1, "El id del cliente no puede estar vacío")
);

export const phoneSchema = v.pipe(
	v.union([v.string(), v.number()]),
	v.transform((value) => {
		let str = String(value).trim();

		// Si tiene 11 dígitos, eliminar el primero
		if (str.length === 11 && /^\d{11}$/.test(str)) {
			str = str.substring(1);
		}

		return str;
	}),
	v.regex(/^\d+$/, "El número debe contener solo dígitos"),
	v.check((value) => {
		// Rechazar "0" o cualquier número que no tenga exactamente 10 dígitos
		if (value === "0" || value.length !== 10) {
			return false;
		}
		return true;
	}, "El número debe tener exactamente 10 dígitos y no puede ser '0'")
);
