const headersPossibleFutures = {
	cashless: "CASHLESS",
	materialVerificar: "MATERIAL",
	cajasTotal: "CANTIDAD CAJAS",
	numberPedidoVerificar: "N° PEDIDO CLIENTE",
	promHorario: "PROMEDIO DE HORA",
	numberPedido: "N° PEDIDO",
	material: "TIPO MATERIAL",
};

export const HEADER_MAP_CONSOLIDADO: Record<string, string> = {
	idCliente: "ID CLIENTE",
	nameEstablecimiento: "NOMBRE ESTABLECIMIENTO",
	phone: "PHONE MOBILE",
	status: "STATUS",
	idClienteComparar: "ID USUARIO COMPARAR",
	horaInicial: "HORA INICIAL",
	horaFinal: "HORA FINAL",
	idClienteVerificar: "ID CLIENTE VERIFICAR",
	codRechazo: "CODE RECHAZO",
	phoneConfirmar: "PHONE MOBILE CONFIRMAR",
	fechaPref: "FECHA PREFE",
};

export const normalizeKey = (key: string): string => {
	return key
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]/g, ""); // Esto elimina puntos, guiones bajos, etc.
};

export const normalizeRowData = (
	row: Record<string, unknown>
): Record<string, unknown> => {
	const normalized: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(row)) {
		const normalizedKey = normalizeKey(key);
		const mappedKey = HEADER_MAP_CONSOLIDADO[normalizedKey];

		if (mappedKey) {
			normalized[mappedKey] = value;
		}
	}

	return normalized;
};
