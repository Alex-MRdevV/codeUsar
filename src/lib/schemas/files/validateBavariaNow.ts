import {
	type dataConsolidadaBavariaNow,
	uploadDataBavariaNow,
} from "@/lib/schemas/files/bavariaNow";
import { safeParse } from "valibot";

export const validateAndFilterData = (rows: any[]) => {
	const processedRows = rows.map((row, index) => {
		const rowNumber = index + 2;

		// Ya no hay validación: solo verificamos si hay datos mínimos
		try {
			const requiredFields = ["Cliente", "No ped Cliente"];

			const missing = requiredFields.filter((f) => !row[f] || row[f] === "");

			if (missing.length > 0) {
				return {
					valid: false,
					rowNumber,
					errors: missing.map((f) => `Falta el campo ${f}`),
				} as const;
			}

			return {
				valid: true,
				rowNumber,
				data: row,
			} as const;
		} catch (error) {
			return {
				valid: false,
				rowNumber,
				errors: [error instanceof Error ? error.message : "Error desconocido"],
			} as const;
		}
	});

	// Filtrar válidas e inválidas
	const validRows = processedRows.filter(
		(row): row is { valid: true; rowNumber: number; data: any } => row.valid
	);
	const invalidRows = processedRows
		.filter((row) => !row.valid)
		.map((row) => ({
			row: row.rowNumber,
			errors: row.errors,
		}));

	// --- AGRUPACIÓN ---
	const groupedOrders = validRows.reduce(
		(acc, row) => {
			const data = row.data;

			const clientKey = data.Cliente;
			const orderKey = data["No ped Cliente"];

			if (!acc[clientKey]) {
				acc[clientKey] = {
					clienteInfo: {
						id: clientKey,
						nombre: data["Nombre establecimiento"] ?? "",
						cashless: data.Cashless === "SI" ? "SI" : "NO",
					},
					pedidos: {},
				};
			}

			if (!acc[clientKey].pedidos[orderKey]) {
				acc[clientKey].pedidos[orderKey] = {
					numeroPedido: orderKey,
					fechaPreferente: data["Fecha pref"] ?? "",
					referenciaProducto: [],
				};
			}

			// Añadir material
			acc[clientKey].pedidos[orderKey].referenciaProducto.push({
				material: data.Material,
				codRechazo: data["Cod Rechazo"],
				cajas: Number(data.Cajas ?? 0),
			});

			return acc;
		},
		{} as Record<
			string,
			{
				clienteInfo: {
					id: string;
					nombre: string;
					cashless?: "SI" | "NO";
				};
				pedidos: Record<
					string,
					{
						numeroPedido: string;
						fechaPreferente: string;
						referenciaProducto: {
							material: string;
							codRechazo?: string;
							cajas: number;
						}[];
					}
				>;
			}
		>
	);

	// Resumen
	const clientesCount = Object.keys(groupedOrders).length;
	const pedidosCount = Object.values(groupedOrders).reduce(
		(t, c) => t + Object.keys(c.pedidos).length,
		0
	);
	const materialesCount = Object.values(groupedOrders).reduce(
		(t, c) =>
			t +
			Object.values(c.pedidos).reduce(
				(sub, p) => sub + p.referenciaProducto.length,
				0
			),
		0
	);

	return {
		groupedOrders,
		summary: {
			total: rows.length,
			valid: validRows.length,
			invalid: invalidRows.length,
			clientes: clientesCount,
			pedidos: pedidosCount,
			referenciaProducto: materialesCount,
		},
		invalidRows,
	};
};
