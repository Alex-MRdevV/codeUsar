import type { clientesEnRuta, dataUsar } from "@/utils/types/send";

// Fuera de cualquier componente/hook
export const buildTemplateVars = (
	phoneNumber: string,
	dataMensajes: dataUsar[],
	dataClientesRuta: clientesEnRuta[]
): Record<string, string> => {
	const messageData = dataMensajes?.find((msg) => msg.phone === phoneNumber);
	if (!messageData) return {};

	const nombreCliente = messageData.name || "Cliente";

	switch (messageData.typeMessage) {
		case "pedidos_no_planeados":
		case "pedidos_retrasados":
		case "bavaria_now_confirmar":
			return {
				"2": nombreCliente,
			};
		case "pedidosEnRUTADOS": {
			const clientData = dataClientesRuta?.find(
				(client) => client.phoneNumber === phoneNumber
			);
			return {
				"1": clientData?.horaInicial ?? "6:00 am",
				"2": clientData?.horaFinal ?? "6:30 am",
			};
		}
		default:
			return {};
	}
};
