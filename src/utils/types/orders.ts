export interface InsertOrdersResponse {
	message: string;
	/**
	 * Lista de IDs de cliente cuyos campos cashless fueron actualizados.
	 * Cada valor corresponde al clienteInfo.id que enviaste.
	 */
	updatedClients: string[];
	/**
	 * Lista de números de pedido que fueron insertados correctamente.
	 * Corresponden al campo numeroPedido.
	 */
	insertedOrders: string[];
	/**
	 * Lista de números de pedido que NO fueron insertados porque
	 * ya existían (orderNumber UNIQUE).
	 */
	skippedOrders: string[];
	/**
	 * Lista de IDs de items insertados (UUID generados en PHP).
	 */
	insertedItems: string[];
}
