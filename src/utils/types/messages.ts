import { type ResultadoAgrupado as ResultBavaria } from "@/utils/types/bavariaNowData";
import { type ResultadoAgrupado } from "@/utils/types/consolidadoData";

export interface dataUsarMessages {
	dataConsolidado: ResultadoAgrupado;
	dataBavariaNow?: ResultBavaria;
}
