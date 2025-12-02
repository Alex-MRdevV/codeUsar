// messagesDataStore.ts
import type { ResultadoAgrupado as ResultBavaria } from "@/utils/types/bavariaNowData";
import type { ResultadoAgrupado } from "@/utils/types/consolidadoData";
import type { dataUsarMessages } from "@/utils/types/messages";
import { atom } from "nanostores";

// Estado inicial
const initialState: dataUsarMessages = {
	dataConsolidado: {
		byStatus: {
			enRuta: [],
			segundoViaje: [],
			aplazado: [],
		},
		summary: {
			total: 0,
			valid: 0,
			invalid: 0,
			enRuta: 0,
			segundoViaje: 0,
			aplazado: 0,
		},
		invalidRows: [],
	},
	dataBavariaNow: undefined,
};

// 🔥 Store principal
export const messagesDataStore = atom<dataUsarMessages>(initialState);

// -----------------------------
// 🚀 ACCIONES
// -----------------------------

// 1. Reemplazar toda la data consolidada
export function setDataConsolidado(data: ResultadoAgrupado) {
	messagesDataStore.set({
		...messagesDataStore.get(),
		dataConsolidado: data,
	});
}

// 2. Establecer la data de Bavaria Now
export function setDataBavaria(data: ResultBavaria) {
	messagesDataStore.set({
		...messagesDataStore.get(),
		dataBavariaNow: data,
	});
}

// 3. Mezclar/parcialmente actualizar
export function updateMessagesData(partial: Partial<dataUsarMessages>) {
	messagesDataStore.set({
		...messagesDataStore.get(),
		...partial,
	});
}

// 4. Limpiar todo
export function resetMessagesData() {
	messagesDataStore.set(initialState);
}
