import {
	type dataConsolidadaBavariaNow,
	uploadDataBavariaNow,
} from "@/lib/schemas/files/bavariaNow";
import { safeParse } from "valibot";

export const validateAndFilterData = (rows: unknown[]) => {
	const processedRows = rows.map((rawRow, index) => {
		const rowNumber = index + 2;

		try {
			const normalizedRow = rawRow as Record<string, unknown>;
			const result = safeParse(uploadDataBavariaNow, normalizedRow);

			if (!result.success) {
				const errors = result.issues.map((issue) => {
					const path = issue.path?.map((p) => p.key).join(".") || "Campo";
					return `${path}: ${issue.message}`;
				});
				return { valid: false, rowNumber, errors } as const;
			}

			return {
				valid: true,
				rowNumber,
				data: result.output,
			} as const;
		} catch (error) {
			return {
				valid: false,
				rowNumber,
				errors: [error instanceof Error ? error.message : "Error desconocido"],
			} as const;
		}
	});

	// Separar filas válidas e inválidas
	const validRows = processedRows.filter(
		(
			row
		): row is {
			valid: true;
			rowNumber: number;
			data: dataConsolidadaBavariaNow;
		} => row.valid
	);
	const invalidRows = processedRows
		.filter((row) => !row.valid)
		.map((row) => ({
			row: row.rowNumber,
			errors: row.errors,
		}));

	// Agrupar por cliente y número de pedido
	const groupedOrders = validRows.reduce(
		(acc, row) => {
			const {
				Cliente,
				"No ped Cliente": numeroPedido,
				...orderData
			} = row.data;

			const clientKey = Cliente;
			const orderKey = numeroPedido;

			// Agregar material al pedido
			acc[clientKey].pedidos[orderKey].referenciaProducto.push({
				material: orderData.Material,
				codRechazo: orderData["Cod Rechazo"],
				cajas: orderData.Cajas,
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

	// Calcular resumen
	const clientesCount = Object.keys(groupedOrders).length;
	const pedidosCount = Object.values(groupedOrders).reduce(
		(total, cliente) => total + Object.keys(cliente.pedidos).length,
		0
	);
	const materialesCount = Object.values(groupedOrders).reduce(
		(total, cliente) =>
			total +
			Object.values(cliente.pedidos).reduce(
				(subTotal, pedido) => subTotal + pedido.referenciaProducto.length,
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
