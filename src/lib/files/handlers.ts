import { processConsped } from "@/lib/files/process/consped";
import { processEta } from "@/lib/files/process/eta";
import { processPedidos } from "@/lib/files/process/pedidos";
import { processRutero } from "@/lib/files/process/rutero";

export const fileHandlers: Record<string, (file: File) => Promise<Response>> = {
	"consped.xlsx": processConsped,
	"ruteroPlantilla.xlsx": processRutero,
	"pedidos.xlsx": processPedidos,
	"eta.xlsx": processEta,
};
