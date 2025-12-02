import { ButtonEnvio } from "@/components/messages/buttonEnvio";
import { CreateTemplateModal } from "@/components/messages/editor/modalTemplates";
import { PreviewCard } from "@/components/messages/editor/previewCard";
import { TemplateSelector } from "@/components/messages/editor/templaterSelector";
import { VariableEditor } from "@/components/messages/editor/variablesEditor";
import { ResultsCard } from "@/components/messages/resultsCard";
import { Button } from "@/components/ui/button";
import { useBatchSender } from "@/hooks/common/use-senderBatch";
import { sendWhatsAppMessage } from "@/lib/providersMensajes/callApi/useApi";
import type { SendMessageRequest } from "@/utils/types/providers/meta";
import type { Template } from "@/utils/types/templates";
import { useState } from "react";
import { ProgressComponent } from "../progress";
import { Header } from "./header";
import { messagesDataStore } from "@/stores/dataStores";
import { useStore } from "@nanostores/react";

interface Props {
	templates: Template[];
}

export const SendMessages = ({ templates: initialTemplates }: Props) => {
	// 🔥 Obtener datos desde nanostores
	const { dataConsolidado, dataBavariaNow } = useStore(messagesDataStore);

	const [selectedTemplate, setSelectedTemplate] = useState("");
	const [templates, setTemplates] = useState(initialTemplates);
	const [recipients, setRecipients] = useState<string[]>([]);
	const [variableValues, setVariableValues] = useState<Record<string, string>>({});
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [resultados, setResultados] = useState<any | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		progress,
		isProcessing,
		completed,
		currentBatch,
		totalBatches,
		error,
		isCancelled,
		isPaused,
		sendInBatches,
		cancel,
		pause,
		resume,
		reset,
	} = useBatchSender<string>(10);

	const currentTemplate = templates.find(t => t.id === selectedTemplate);
	const vars = currentTemplate?.variables;
	const hasVars = vars !== undefined && vars.params.length > 0;

	const resetResultados = () => {
		setResultados(null);
	};

	const handleNewSend = () => {
		resetResultados();
		setRecipients([]);
		setSelectedTemplate("");
		setVariableValues({});
		reset();
	};

	const handleTemplateChange = (templateId: string) => {
		setSelectedTemplate(templateId);
		setVariableValues({});
	};

	// 🔥 Extrae teléfonos y datos según la plantilla seleccionada usando NANOSTORE
	const buildRecipients = () => {
		if (!dataConsolidado) return [];

		// Ejemplo: enviar solo a clientes enRuta
		return dataConsolidado.byStatus.enRuta.map(c => c.phoneNumber);
	};

	// 🔥 Construye el payload compatible con tu API
	const buildPayload = (recipient: string): SendMessageRequest => {
		if (!currentTemplate) {
			throw new Error("No template selected");
		}

		const paramFormatRaw = currentTemplate?.variables?.format;
		const isPositional =
			(typeof paramFormatRaw === "string" && paramFormatRaw.toUpperCase() === "POSITIONAL") ||
			paramFormatRaw === "positional";

		return {
			templateId: currentTemplate.id,
			recipients: [recipient],
			messageType: "template",
			templateName: currentTemplate.name,
			templateLanguage: currentTemplate.language || "es",
			parameterFormat: isPositional ? "positional" : "named",

			templateParamsPositional: isPositional ? Object.values(variableValues) : undefined,
			templateParams: !isPositional ? variableValues : undefined,
		};
	};

	const handleSendMessages = async () => {
		setIsSubmitting(true);

		const recipientsList = buildRecipients();
		setRecipients(recipientsList);

		await sendInBatches(
			recipientsList,
			async (batch) => {
				for (const phone of batch) {
					const payload = buildPayload(phone);
					await sendWhatsAppMessage(payload);
				}

				await new Promise(r => setTimeout(r, 500));
			},
			1000
		);

		setResultados({ ok: true, enviados: recipientsList.length });
		setIsSubmitting(false);
	};

	const handleSendMessage = async () => {
		if (!currentTemplate) return;
		await handleSendMessages();
	};

	const handleCreateTemplate = async (newTemplate: Template) => {
		setTemplates(prev => [...prev, newTemplate]);
		setShowCreateModal(false);
	};

	const canSend = () => {
		if (!selectedTemplate || isSubmitting) return false;

		if (currentTemplate?.variables) {
			return currentTemplate.variables.params.every(
				param => variableValues[param.name]?.trim()
			);
		}
		return true;
	};

	return (
		<article className="p-4 sm:p-6 lg:p-8 w-full max-w-[1800px] mx-auto">
			<Header setShowCreateModal={setShowCreateModal} />

			{/* GRID RESPONSIVE */}
			<div
				className="
			grid 
			grid-cols-1 
			md:grid-cols-2 
			lg:grid-cols-3 
			gap-6
			w-full
		"
			>
				{/* COLUMNA PRINCIPAL */}
				<div className="col-span-1 md:col-span-2 space-y-6">
					{resultados ? (
						<div className="space-y-4">
							<ResultsCard resultados={resultados} onClose={handleNewSend} />

							<Button
								onClick={handleNewSend}
								className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-semibold"
							>
								Enviar nuevos mensajes
							</Button>
						</div>
					) : (
						<>
							<TemplateSelector
								value={selectedTemplate}
								templates={templates}
								onChange={handleTemplateChange}
							/>

							{hasVars && (
								<div className="bg-card border border-border rounded-lg p-6">
									<VariableEditor
										variables={vars!}
										values={variableValues}
										onChange={setVariableValues}
									/>
								</div>
							)}

							<ButtonEnvio
								canSend={canSend}
								handleSendMessage={handleSendMessage}
								isSubmitting={isSubmitting}
								recipients={recipients}
							/>

							{!canSend() &&
								selectedTemplate &&
								currentTemplate?.variables && (
									<div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
										<p className="text-sm text-yellow-600 dark:text-yellow-400">
											⚠️ Completa todas las variables requeridas antes de enviar
										</p>
									</div>
								)}
						</>
					)}
				</div>

				{/* COLUMNA LATERAL (PREVIEW / PROGRESO) */}
				<div className="col-span-1 space-y-6">
					{(isProcessing || isPaused || completed || error || isCancelled) && (
						<ProgressComponent
							error={error}
							isCancelled={isCancelled}
							completed={completed}
							isProcessing={isProcessing}
							progress={progress}
							currentBatch={currentBatch}
							totalBatches={totalBatches}
							isPaused={isPaused}
							onCancel={cancel}
							onPause={pause}
							onResume={resume}
							onReset={reset}
							title="Envío de Mensajes"
							showCancelButton={true}
						/>
					)}

					{!resultados && currentTemplate && (
						<PreviewCard
							template={currentTemplate}
							variableValues={variableValues}
							recipients={recipients}
						/>
					)}
				</div>
			</div>

			{/* MODAL */}
			{showCreateModal && (
				<CreateTemplateModal
					onClose={() => setShowCreateModal(false)}
					onSuccess={handleCreateTemplate}
				/>
			)}
		</article>

	)
};
