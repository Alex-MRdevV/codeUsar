import { LoadingWrapper } from "@/components/loading/wrapper";
import { MessagesFlyingCards } from "@/components/messages/flyingMessages";
import { ContentForSend } from "@/components/messages/send/contentForSend";
import { PreviewSection } from "@/components/messages/send/previewSection";
import { PreviewSendComponent } from "@/components/messages/send/previewSend";
import { useMessagesLogicTemplates } from "@/hooks/use-logicMessageByTemplates";
import { useSendMessage } from "@/hooks/use-messagesSend";
import { useSendTemplates } from "@/hooks/use-templatesSend";
import { allDataClientesMensajes } from "@/utils/services/dataTransitoria/allData";
import { allDataRuta } from "@/utils/services/dataTransitoria/allDataRutas";
import { getTargetStatusForTemplate } from "@/utils/types/messages";
import type { clientesEnRuta } from "@/utils/types/send";
import { type dataUsar } from "@/utils/types/send";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const SendMessagesContainer = () => {
	const [dataClientesRuta, setDataClientesRuta] = useState<clientesEnRuta[]>([]);
	const [dataMensajes, setDataMensajes] = useState<dataUsar[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const {
		currentTemplate,
		selectedTemplate,
		variableValues,
		isTemplateMode,
		handleNewSend,
		handleTemplateChange,
		hasVars,
		vars,
		setVariableValues,
		data,
		setSelectedTemplate
	} = useSendTemplates();

	useEffect(() => {
		async function load() {
			try {
				const resRuta = await allDataRuta();
				const resMensajes = await allDataClientesMensajes();
				setDataClientesRuta(resRuta || []);
				setDataMensajes(resMensajes || []);
			} catch {
				toast.error("Ocurrió un error imprevisto");
			} finally {
				setIsLoading(false);
			}
		}
		load();
	}, []);

	const {
		recipients,
		buildPayload,
		canSend,
		getRecipientCount
	} = useMessagesLogicTemplates({
		currentTemplate,
		selectedTemplate,
		variableValues,
		dataClientesRuta,
		dataMensajes
	});

	const send = useSendMessage({
		buildPayload,
		recipients,
		type: "template"
	});

	if (isLoading || !data) {
		return <LoadingWrapper isLoading message="Cargando..." />;
	}

	const handleSendMessagesWrapper = async () => {
		const result = await send.handleSendMessages();
		if (result?.shouldCleanState) {
			send.resetResultados();
			setSelectedTemplate("");
			setVariableValues({});
			send.reset();
		}
	};

	return (
		<article className="p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 w-full max-w-[1800px] mx-auto">
			<MessagesFlyingCards messages={send.flyingMessages} />

			<section className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<ContentForSend
					currentTemplate={currentTemplate}
					dataMensajes={dataMensajes}
					getRecipientCount={getRecipientCount}
					getTargetStatusForTemplate={getTargetStatusForTemplate}
					handleNewSend={handleNewSend}
					handleTemplateChange={handleTemplateChange}
					resultados={send.resultados}
					selectedTemplate={selectedTemplate}
					templates={data}
				/>

				<PreviewSendComponent
					canSend={canSend}
					dataClientesRuta={dataClientesRuta}
					handleSendMessage={handleSendMessagesWrapper}
					hasVars={hasVars}
					isSubmitting={send.isSubmitting}
					recipients={recipients}
					selectedTemplate={selectedTemplate}
					setVariableValues={setVariableValues}
					variableValues={variableValues}
					vars={vars}
				/>

				<PreviewSection
					cancel={send.cancel}
					completed={send.completed}
					currentBatch={send.currentBatch}
					currentTemplate={currentTemplate}
					error={send.error}
					isCancelled={send.isCancelled}
					isPaused={send.isPaused}
					isProcessing={send.isProcessing}
					pause={send.pause}
					progress={send.progress}
					recipients={recipients}
					reset={send.reset}
					resultados={send.resultados}
					resume={send.resume}
					totalBatches={send.totalBatches}
				/>
			</section>
		</article>
	);
};
