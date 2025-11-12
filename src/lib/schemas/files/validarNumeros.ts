import { z } from "zod";

export const uploadNumbers = z
	.object({
		Telefono: z.union([
			z
				.string({
					message: "El número de teléfono debe ser un texto válido",
				})
				.regex(/^[\+]?[(]?[\d\s\-\(\))]{10,}$/, {
					message: "Formato de teléfono es inválido, debe tener 10 números",
				}),
			z
				.number({
					message: "El número de teléfono debe ser un número válido",
				})
				.refine((num) => num.toString().replace(/\D/g, "").length >= 10, {
					message: "El teléfono debe tener al menos 10 dígitos",
				})
				.transform((num) => num.toString()),
		]),
	})
	.strict();
