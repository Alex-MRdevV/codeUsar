import { uploadNumbers } from "@/lib/schemas/files/validarNumeros";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type z from "zod";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const validateAndFilterNumbers = (data: unknown[]) => {
	const validRows: z.infer<typeof uploadNumbers>[] = [];
	const invalidRows: { row: number; data: unknown; errors: string }[] = [];

	data.forEach((row, index) => {
		const result = uploadNumbers.safeParse(row);

		if (result.success) {
			validRows.push(result.data);
		} else {
			invalidRows.push({
				row: index + 1, // +1 para empezar desde 1
				data: row,
				errors: result.error.message,
			});
		}
	});

	return { validRows, invalidRows };
};
