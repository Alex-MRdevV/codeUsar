import { type ResultadoAgrupado as ResultBavaria } from "@/utils/types/bavariaNowData";
import { type ResultadoAgrupado } from "@/utils/types/consolidadoData";

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
	dataConsolidado: PersistedConsolidado;
	dataBavariaNow?: PersistedBavariaNow;
}
