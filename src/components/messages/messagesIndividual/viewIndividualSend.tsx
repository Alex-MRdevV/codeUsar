import { LoadingWrapper } from "@/components/loading/wrapper";
import { SectionConsolidado } from "@/components/messages/messagesIndividual/sectionConsolidado";
import { buildTemplateVars } from "@/components/messages/messagesIndividual/utility";
import { useBulkMessageBuilder } from "@/hooks/use-buildTemplateBuilder";
import { useMessagesLogicTemplates } from "@/hooks/use-logicMessageByTemplates";
import { useSendMessage } from "@/hooks/use-messagesSend";
import { useTemplateMessageBuilder } from "@/hooks/use-templateBuilder";
import { useSendTemplates } from "@/hooks/use-templatesSend";
import type { Message } from "@/utils/types/messages";
import type { clientesEnRuta, dataUsar } from "@/utils/types/send";
import { uuid } from "@/utils/uuid";
import { useMemo, useState } from "react";

export const SendMessagesView = () => {
	const [manualMessages, setManualMessages] = useState<Message[]>([]);
	const [dataMensajes, setDataMensajes] = useState<dataUsar[]>([]);
	const [dataClientesRuta, setDataClientesRuta] = useState<clientesEnRuta[]>([]);
	const [phone, setPhone] = useState("");
	const [name, setName] = useState("");
	const [content, setContent] = useState("");
	const [horaInicial, setHoraInicial] = useState("");
	const [horaFinal, setHoraFinal] = useState("");

	const { currentTemplate, data, handleNewSend, handleTemplateChange, hasVars, isTemplateMode, selectedTemplate, setIsTemplateMode, setSelectedTemplate, setVariableValues, variableValues, vars, handleVariableChange } = useSendTemplates()

	// Hook para construir mensajes individuales
	const {
		buildMessage,
		areVariablesComplete,
		previewMessage
	} = useTemplateMessageBuilder({
		template: currentTemplate,
		variableValues,
	});

	const isManual = !selectedTemplate || selectedTemplate === "";

	// Para construir mensajes masivos
	const bulkRecipients = useMemo(() => {
		return dataMensajes.map((d) => ({
			phone: d.phone,
			variables: buildTemplateVars(d.phone, dataMensajes, dataClientesRuta),
		}));
	}, [dataMensajes, dataClientesRuta]);

	const { messages: bulkMessages } = useBulkMessageBuilder({
		template: currentTemplate,
		recipients: bulkRecipients,
	});

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

	const { cancel, completed, currentBatch, error, flyingMessages, handleSendMessages, isCancelled, isPaused, isProcessing, pause, progress, reset, resetResultados, resultados, resume, totalBatches, isSubmitting } = useSendMessage({
		buildPayload,
		recipients,
		type: "template"
	})

	const uiMessages = useMemo(() => {
		const ruta = dataClientesRuta.map((c) => ({
			id: uuid.uuid,
			phone: c.phoneNumber,
			name: "Cliente Ruta",
			content: buildMessage({
				"Hora de inicio": c.horaInicial,
				"Hora de fin": c.horaFinal,
			}),
		}));

		const templated = bulkMessages.map((msg) => ({
			id: uuid.uuid,
			phone: msg.phone,
			name: dataMensajes.find(d => d.phone === msg.phone)?.name || "Cliente",
			content: msg.content,
		}));

		return [...ruta, ...templated, ...manualMessages];
	}, [dataClientesRuta, bulkMessages, manualMessages, buildMessage]);

	// MOVIDO: La verificación de data ahora está DESPUÉS de todos los hooks
	if (!data) {
		return <LoadingWrapper isLoading={true} message="Cargando..." />
	}

	const handleSendMessagesWrapper = async () => {
		const result = await handleSendMessages();

		if (result?.shouldCleanState) {
			resetResultados();
			setSelectedTemplate("");
			setVariableValues({});
			reset();
		}
	};

	const addClientToRuta = () => {
		if (!phone.trim()) return;

		const newClient: clientesEnRuta & { __id: string } = {
			phoneNumber: phone,
			horaInicial: horaInicial || new Date().toISOString(),
			horaFinal: horaFinal || "",
			tipoMensaje: "pedidosEnRUTADOS",
			__id: uuid.uuid,
		};

		setDataClientesRuta(prev => [...prev, newClient]);
		setPhone("");
		setHoraInicial("");
		setHoraFinal("");
	};

	const addManualMessage = () => {
		if (!content.trim() || !phone.trim()) return;

		const newMsg: Message = {
			id: uuid.uuid,
			phone,
			name,
			content,
		};

		setManualMessages(prev => [...prev, newMsg]);

		setPhone("");
		setName("");
		setContent("");
	};

	const addDataMessageTemplates = () => {
		if (!phone.trim() || !currentTemplate) return;

		const newMsg: dataUsar & { __id: string } = {
			name: name || "Sin nombre",
			phone,
			typeMessage: currentTemplate.name as dataUsar["typeMessage"],
			__id: uuid.uuid,
		};

		setDataMensajes(prev => [...prev, newMsg]);

		setContent("");
		setPhone("");
		setName("");
	};

	const removeFromOriginalSource = (id: string) => {
		// Elimina mensajes manuales por id
		setManualMessages(prev => prev.filter(m => m.id !== id));

		// Elimina dataUsar por __id si existe
		setDataMensajes(prev => prev.filter((d: any) => d.__id !== id));

		// Elimina clientsInRuta por __id si existe
		setDataClientesRuta(prev => prev.filter((c: any) => c.__id !== id));
	};

	return (
		<SectionConsolidado
			addClientToRuta={addClientToRuta}
			addDataMessageTemplates={addDataMessageTemplates}
			addManualMessage={addManualMessage}
			canSend={canSend}
			cancel={cancel}
			completed={completed}
			content={content}
			currentBatch={currentBatch}
			currentTemplate={currentTemplate}
			dataClientesRuta={dataClientesRuta}
			error={error}
			getRecipientCount={getRecipientCount}
			handleNewSend={handleNewSend}
			handleSendMessagesWrapper={handleSendMessagesWrapper}
			handleTemplateChange={handleTemplateChange}
			handleVariableChange={handleVariableChange}
			hasVariables={hasVars}
			isCancelled={isCancelled}
			isManual={isManual}
			uiMessages={uiMessages}
			isPaused={isPaused}
			isProcessing={isProcessing}
			isSubmitting={isSubmitting}
			name={name}
			pause={pause}
			phone={phone}
			progress={progress}
			recipients={recipients}
			reset={reset}
			resultados={resultados}
			resume={resume}
			selectedTemplate={selectedTemplate}
			setContent={setContent}
			setName={setName}
			setPhone={setPhone}
			templates={data}
			totalBatches={totalBatches}
			variableValues={variableValues}
			removeFromOriginalSource={removeFromOriginalSource}
		/>
	)
}
