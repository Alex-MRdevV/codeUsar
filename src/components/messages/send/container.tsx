import { allDataClientesMensajes } from "@/utils/services/dataTransitoria/allData";
import { allDataRuta } from "@/utils/services/dataTransitoria/allDataRutas";
import { getTemplates } from "@/utils/services/templates/all";
import type { clientsInRuta, dataUsar } from "@/utils/types/messages";
import type { Template } from "@/utils/types/templates";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SendLogic } from "./logic";

export const SendContainer = () => {
	const [data, setData] = useState<Template[] | null>(null)
	const [dataClientesRuta, setDataClientesRuta] = useState<clientsInRuta[] | null>(null);
	const [dataMensajes, setDataMensajes] = useState<dataUsar[] | null>(null);
	const [selectedTemplate, setSelectedTemplate] = useState<string>("");
	const [variableValues, setVariableValues] = useState<Record<string, string>>({});

	useEffect(() => {
		async function load() {
			try {
				const res = await allDataRuta();
				const resClientesMensajes = await allDataClientesMensajes();
				setDataClientesRuta(res);
				setDataMensajes(resClientesMensajes);
				const [err, data] = await getTemplates();
				if (err) return toast.error("Ha sucedido un error")
				setData(data);
			} catch (err) {
				toast.error("Ocurrió un error imprevisto");
			}
		}

		load();
	}, []);

	if (!data || !dataClientesRuta || !dataMensajes) return null

	return (
		<SendLogic
			data={data}
			dataClientesRuta={dataClientesRuta}
			dataMensajes={dataMensajes}
			selectedTemplate={selectedTemplate}
			variableValues={variableValues}
			setSelectedTemplate={setSelectedTemplate}
			setVariableValues={setVariableValues}
		/>
	)
}
