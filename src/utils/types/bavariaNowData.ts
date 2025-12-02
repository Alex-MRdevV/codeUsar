export type MaterialPedido = {
	material: string;
	codRechazo?: string;
	cajas: number;
};

export interface SendGroupedOrdersPayload {
	groupedOrders: Record<string, ClienteAgrupado>;
}

export type PedidoAgrupado = {
	numeroPedido: string;
	fechaPreferente: string;
	referenciaProducto: MaterialPedido[];
};

export type ClienteAgrupado = {
	clienteInfo: {
		id: string;
		nombre: string;
		cashless?: "SI" | "NO";
	};
	pedidos: Record<string, PedidoAgrupado>;
};

export type ResultadoAgrupado = {
	groupedOrders: Record<string, ClienteAgrupado>;
	summary: {
		total: number;
		valid: number;
		invalid: number;
		clientes: number;
		pedidos: number;
		referenciaProducto: number;
	};
	invalidRows: Array<{
		row: number;
		errors: string[];
	}>;
};

