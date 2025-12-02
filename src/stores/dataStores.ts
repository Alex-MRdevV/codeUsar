// messagesDataStore.ts
import type { ResultadoAgrupado as ResultBavaria } from "@/utils/types/bavariaNowData";
import type { ResultadoAgrupado } from "@/utils/types/consolidadoData";
import type {
	dataUsarMessages,
	PersistedConsolidado,
	PersistedBavariaNow,
} from "@/utils/types/messages";
import { atom } from "nanostores";

/* -----------------------------------------------------
 *  TIPOS REDUCIDOS PARA GUARDAR
 * ---------------------------------------------------*/

/* -----------------------------------------------------
 * REDUCCIÓN DE DATA ANTES DE GUARDAR
 * ---------------------------------------------------*/
function reduceConsolidado(full: ResultadoAgrupado): PersistedConsolidado {
	if (!full?.byStatus) {
		return {
			byStatus: { enRuta: [], segundoViaje: [], aplazado: [] },
		};
	}

	const simplify = (arr: any[]) =>
		arr.map((c) => ({
			phoneNumber: c.phoneNumber,
			clienteId: c.clienteId,
			nameEstablecimiento: c.nameEstablecimiento,
			horaInicial: c.horaInicial,
			horaFinal: c.horaFinal,
		}));

	return {
		byStatus: {
			enRuta: simplify(full.byStatus.enRuta ?? []),
			segundoViaje: simplify(full.byStatus.segundoViaje ?? []),
			aplazado: simplify(full.byStatus.aplazado ?? []),
		},
	};
}

function reduceBavariaNow(full: ResultBavaria): PersistedBavariaNow {
	if (!full?.groupedOrders) return { groupedOrders: {} };

	const reduced: PersistedBavariaNow["groupedOrders"] = {};

	for (const [clienteId, info] of Object.entries(full.groupedOrders)) {
		reduced[clienteId] = {
			clienteInfo: {
				nombre: info?.clienteInfo?.nombre ?? null,
			},
		};
	}

	return { groupedOrders: reduced };
}

/* -----------------------------------------------------
 * KEYS DE STORAGE
 * ---------------------------------------------------*/
const STORAGE_KEYS = {
	CONSOLIDADO: "app_data_consolidado",
	BAVARIA: "app_data_bavaria",
} as const;

/* -----------------------------------------------------
 * ESTADO INICIAL
 * ---------------------------------------------------*/
const initialState: dataUsarMessages = {
	dataConsolidado: {
		byStatus: { enRuta: [], segundoViaje: [], aplazado: [] },
	},
	dataBavariaNow: undefined,
};

/* -----------------------------------------------------
 * FUNCIONES SEGURO PARA STORAGE
 * ---------------------------------------------------*/
function safeSave(key: string, value: unknown) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error: any) {
		console.error(`❌ Error guardando en localStorage: ${key}`, error);
		if (error?.name === "QuotaExceededError") {
			console.warn("⚠️ QUOTA EXCEEDED → limpiando esa key");
			localStorage.removeItem(key);
		}
	}
}

function load<T>(key: string): T | null {
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

function remove(key: string) {
	try {
		localStorage.removeItem(key);
	} catch {}
}

/* -----------------------------------------------------
 * RESTAURAR ESTADO DESDE STORAGE
 * ---------------------------------------------------*/
function getInitialStateFromStorage(): dataUsarMessages {
	const savedConsolidado = load<PersistedConsolidado>(STORAGE_KEYS.CONSOLIDADO);
	const savedBavaria = load<PersistedBavariaNow>(STORAGE_KEYS.BAVARIA);

	return {
		dataConsolidado: savedConsolidado
			? { ...initialState.dataConsolidado, byStatus: savedConsolidado.byStatus }
			: initialState.dataConsolidado,

		dataBavariaNow: savedBavaria || undefined,
	};
}

/* -----------------------------------------------------
 * NANOSTORE
 * ---------------------------------------------------*/
export const messagesDataStore = atom<dataUsarMessages>(
	getInitialStateFromStorage()
);

/* -----------------------------------------------------
 * ACCIONES
 * ---------------------------------------------------*/

// 🔥 Guardar consolidado (pero reducido)
export function setDataConsolidado(fullData: ResultadoAgrupado) {
	const reduced = reduceConsolidado(fullData);

	messagesDataStore.set({
		...messagesDataStore.get(),
		dataConsolidado: {
			...initialState.dataConsolidado,
			byStatus: reduced.byStatus,
		},
	});

	safeSave(STORAGE_KEYS.CONSOLIDADO, reduced);
}

// 🔥 Guardar Bavaria Now (pero reducido)
export function setDataBavaria(fullData: ResultBavaria) {
	const reduced = reduceBavariaNow(fullData);

	messagesDataStore.set({
		...messagesDataStore.get(),
		dataBavariaNow: reduced,
	});

	safeSave(STORAGE_KEYS.BAVARIA, reduced);
}

// 🔥 Actualizar parcialmente
export function updateMessagesData(partial: Partial<dataUsarMessages>) {
	const current = messagesDataStore.get();
	const updated = { ...current, ...partial };

	messagesDataStore.set(updated);

	if (partial.dataConsolidado) {
		const reduced = reduceConsolidado(
			partial.dataConsolidado as ResultadoAgrupado
		);
		safeSave(STORAGE_KEYS.CONSOLIDADO, reduced);
	}

	if (partial.dataBavariaNow) {
		const reduced = reduceBavariaNow(partial.dataBavariaNow as ResultBavaria);
		safeSave(STORAGE_KEYS.BAVARIA, reduced);
	}
}

// 🔥 Obtener data actual
export function getMessagesData(): dataUsarMessages {
	return messagesDataStore.get();
}

// 🔥 Limpiar todo
export function resetMessagesData() {
	messagesDataStore.set(initialState);
	remove(STORAGE_KEYS.CONSOLIDADO);
	remove(STORAGE_KEYS.BAVARIA);
}

// 🔥 Check rápido
export function hasData(): boolean {
	const d = messagesDataStore.get();
	return d.dataConsolidado.byStatus.enRuta.length > 0 || !!d.dataBavariaNow;
}
