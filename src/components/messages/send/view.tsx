import { LoadingWrapper } from "@/components/loading/wrapper";
import { ContentSendComponent } from "@/components/messages/send/content";
import { useSendMessagesLogic } from "@/hooks/use-sendMessages";
import { allDataClientesMensajes } from "@/utils/services/dataTransitoria/allData";
import { allDataRuta } from "@/utils/services/dataTransitoria/allDataRutas";
import { getTemplates } from "@/utils/services/templates/all";
import { getTargetStatusForTemplate, type clientsInRuta, type dataUsar } from "@/utils/types/messages";
import type { Template } from "@/utils/types/templates";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export const SendMessagesContainer = () => {
	const [data, setData] = useState<Template[] | null>(null);
	const [dataClientesRuta, setDataClientesRuta] = useState<clientsInRuta[] | null>(null);
	const [dataMensajes, setDataMensajes] = useState<dataUsar[] | null>(null);
	const [selectedTemplate, setSelectedTemplate] = useState<string>("");
	const [variableValues, setVariableValues] = useState<Record<string, string>>({});
	const [showCreateModal, setShowCreateModal] = useState(false);

	useEffect(() => {
		async function load() {
			try {
				const res = await allDataRuta();
				const resClientesMensajes = await allDataClientesMensajes();

				setDataClientesRuta(res);
				setDataMensajes(resClientesMensajes);

				const templates = await getTemplates();
				setData(templates);

			} catch (err) {
				toast.error("Ocurrió un error imprevisto");
			}
		}

		load();
	}, []);

	const currentTemplate = useMemo(
		() => data?.find((t) => t.id === selectedTemplate) || null,
		[data, selectedTemplate]
	);

	const vars = currentTemplate?.variables ?? null;
	const hasVars = Array.isArray(vars?.params) && vars.params.length > 0;
	const {
		recipients,
		isSubmitting,
		resultados,
		canSend,
		handleSendMessages,
		resetResultados,
		getRecipientCount,
		reset,
		cancel,
		completed,
		currentBatch,
		error,
		isPaused,
		isProcessing,
		pause,
		progress,
		resume,
		totalBatches,
		isCancelled,
		flyingMessages
	} = useSendMessagesLogic({
		currentTemplate,
		dataClientesRuta,
		dataMensajes,
		selectedTemplate,
		variableValues,
	});

	const handleSendMessagesWrapper = async () => {
		const result = await handleSendMessages();

		if (result?.shouldCleanState) {
			resetResultados();
			setSelectedTemplate("");
			setVariableValues({});
			reset();
		}
	};

	const handleCreateTemplate = async (newTemplate: Template) => {
		setData((prev) => (prev ? [...prev, newTemplate] : [newTemplate]));
		setShowCreateModal(false);
	};

	const handleTemplateChange = (templateId: string) => {
		setSelectedTemplate(templateId);
		setVariableValues({});
	};

	const handleNewSend = () => {
		resetResultados();
		setSelectedTemplate("");
		setVariableValues({});
		reset();
	};

	if (!data || !dataClientesRuta || !dataMensajes) {
		return <LoadingWrapper isLoading={true} message="Cargando..." />
	}

	return (
		<ContentSendComponent
			canSend={canSend}
			currentTemplate={currentTemplate}
			dataClientesRuta={dataClientesRuta}
			dataMensajes={dataMensajes}
			getRecipientCount={getRecipientCount}
			getTargetStatusForTemplate={getTargetStatusForTemplate}
			handleCreateTemplate={handleCreateTemplate}
			handleNewSend={handleNewSend}
			handleSendMessage={handleSendMessagesWrapper}
			handleTemplateChange={handleTemplateChange}
			hasVars={hasVars}
			isSubmitting={isSubmitting}
			recipients={recipients}
			resultados={resultados}
			selectedTemplate={selectedTemplate}
			setShowCreateModal={setShowCreateModal}
			setVariableValues={setVariableValues}
			showCreateModal={showCreateModal}
			templates={data}
			variableValues={variableValues}
			vars={vars}
			cancel={cancel}
			completed={completed}
			currentBatch={currentBatch}
			error={error}
			isCancelled={isCancelled}
			isPaused={isPaused}
			isProcessing={isProcessing}
			pause={pause}
			progress={progress}
			reset={reset}
			resume={resume}
			totalBatches={totalBatches}
			flyingMessages={flyingMessages}
		/>
	);
};
