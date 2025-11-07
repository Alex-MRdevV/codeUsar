import { z } from "zod";

export const uploadNumbers = z
	.object({
		Cliente: z.union([
			z
				.string({
					message: "El número del cliente debe ser un texto válido",
				})
				.regex(/^[\+]?[(]?[\d\s\-\(\))]{8,}$/, {
					message: "Formato de teléfono es inválido, debe tener 8 números",
				}),
			z
				.number({
					message: "El número del cliente debe ser un número válido",
				})
				.min(8, {
					message: "Formato del numero es inválido, debe tener 8 números",
				})
				.max(8, {
					message: "Formato del numero es inválido, debe tener 8 números",
				})
				.transform((num) => num.toString()),
		]),
		Nombre: z.string({
			error: "Debe ser un texto"
		}),
		Documento: z.union([
			z
				.string({
					message: "El número del documento debe ser un texto válido",
				}),
			z
				.number({
					message: "El número de teléfono debe ser un número válido",
				})
				.min(7, {
					message: "Formato es inválido, debe tener 7 números",
				})
				.max(10, {
					message: "Formato es inválido, debe tener 10 números",
				})
				.transform((num) => num.toString()),
		]),
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
				.min(10, {
					message: "Formato de teléfono es inválido, debe tener 10 números",
				})
				.max(10, {
					message: "Formato de teléfono es inválido, debe tener 10 números",
				})
				.transform((num) => num.toString()),
		]),
	})
	.loose();

export const sheetSchema = z.array(uploadNumbers);
