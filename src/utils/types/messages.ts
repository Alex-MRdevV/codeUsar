export type PersistedConsolidado = {
	byStatus: {
		enRuta: ReducedCliente[];
		segundoViaje: ReducedCliente[];
		aplazado: ReducedCliente[];
	};
};
export type ReducedCliente = {
	phoneNumber: string;
	clienteId: string;
	nameEstablecimiento?: string;
	horaInicial?: string;
	horaFinal?: string;
};

export type PersistedBavariaNow = {
	groupedOrders: {
		[clienteId: string]: {
			clienteInfo?: { nombre?: string };
		};
	};
};

export interface dataUsarMessages {
	dataMessage: dataUsar[];
	dataConsolidado: PersistedConsolidado;
}

export interface dataUsar {
	name: string;
	phone: string;
	typeMessage:
		| "pedidos_no_planeados"
		| "pedidos_retrasados"
		| "confirmar_pedido"
		| "confirmacion_de_pedido";
}
