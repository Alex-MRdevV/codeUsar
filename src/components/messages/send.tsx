import { ButtonEnvio } from "@/components/messages/buttonEnvio";
import { UploadFile } from "@/components/messages/buttonUploadFile";
import { ConfigurarSend } from "@/components/messages/configurarEnvio";
import { CreateTemplateModal } from "@/components/messages/modalTemplates";
import { PreviewCard } from "@/components/messages/previewCard";
import { ResultsCard } from "@/components/messages/resultsCard";
import { TemplateSelector } from "@/components/messages/templaterSelector";
import { VariableEditor } from "@/components/messages/variablesEditor";
import { Button } from "@/components/ui/button";
import { sendWhatsAppMessage } from "@/lib/providersMensajes/callApi/useApi";
import type { SendMessageRequest } from "@/utils/types/providers/meta";
import type { Template } from "@/utils/types/templates";
import { Plus } from "lucide-react";
import { useState } from "react";

interface Props {
	templates: Template[];
}

export const SendMessages = ({ templates: initialTemplates }: Props) => {
	const [templates, setTemplates] = useState(initialTemplates);
	const [recipients, setRecipients] = useState<string[]>([]);
	const [selectedTemplate, setSelectedTemplate] = useState("");
	const [variableValues, setVariableValues] = useState<Record<string, string>>({});
	const [showCreateModal, setShowCreateModal] = useState(false);

	const { createHandler, resultados, resetResultados, isSubmitting } = ConfigurarSend();

	// Obtener template seleccionado
	const currentTemplate = templates.find(t => t.id === selectedTemplate);

	const onSubmit = createHandler(async (formData: SendMessageRequest) => {
		const response = await sendWhatsAppMessage(formData);
		return response;
	});

	// Importar destinatarios desde archivo .txt o .csv
	const handleImportRecipients = (file: File) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const content = e.target?.result as string;
			const importedRecipients = content
				.split("\n")
				.map((line) => line.trim())
				.filter((line) => line.length > 0);
			setRecipients((prev) => [...prev, ...importedRecipients]);
		};
		reader.readAsText(file);
	};

	const handleNewSend = () => {
		resetResultados();
		setRecipients([]);
		setSelectedTemplate("");
		setVariableValues({});
	};

	const handleTemplateChange = (templateId: string) => {
		setSelectedTemplate(templateId);
		setVariableValues({}); // Resetear variables al cambiar de plantilla
	};

	const handleSendMessage = () => {
		if (!currentTemplate) return;

		const datos: SendMessageRequest = {
			templateId: currentTemplate.id,
			recipients,
			messageType: "template",
			templateName: currentTemplate.metaTemplateName,
			templateParams: variableValues,
			templateLanguage: currentTemplate.language || "es",
		};

		onSubmit(datos);
	};

	const handleCreateTemplate = async (newTemplate: Template) => {
		setTemplates(prev => [...prev, newTemplate]);
		setShowCreateModal(false);
	};

	// Validar si se puede enviar
	const canSend = () => {
		if (!selectedTemplate || recipients.length === 0 || isSubmitting) {
			return false;
		}

		if (currentTemplate?.variables) {
			return currentTemplate.variables.params.every(
				param => variableValues[param.name]?.trim()
			);
		}

		return true;
	};

	return (
		<div className="p-8">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-foreground mb-2">Enviar Mensajes</h1>
					<p className="text-muted-foreground">Crea y envía mensajes masivos a tus contactos</p>
				</div>
				<Button
					onClick={() => setShowCreateModal(true)}
					className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
				>
					<Plus size={20} />
					Nueva Plantilla
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Sección principal */}
				<div className="lg:col-span-2 space-y-6">
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
							{/* Selector de plantilla */}
							<TemplateSelector
								value={selectedTemplate}
								templates={templates}
								onChange={handleTemplateChange}
							/>

							{/* Editor de variables */}
							{/* Editor de Variables */} {currentTemplate?.variables && currentTemplate.variables.params.length > 0 && (<div className="bg-card border border-border rounded-lg p-6"> <VariableEditor variables={currentTemplate.variables} values={variableValues} onChange={setVariableValues} /> </div>)}

							{/* Gestión de destinatarios */}
							<UploadFile handleImportRecipients={handleImportRecipients} recipients={recipients} />

							{/* Botón de envío */}
							<ButtonEnvio
								canSend={canSend}
								handleSendMessage={handleSendMessage}
								isSubmitting={isSubmitting}
								recipients={recipients}
							/>

							{/* Advertencia si faltan variables */}
							{!canSend() && selectedTemplate && recipients.length > 0 && currentTemplate?.variables && (
								<div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
									<p className="text-sm text-yellow-600 dark:text-yellow-400">
										⚠️ Completa todas las variables requeridas antes de enviar
									</p>
								</div>
							)}
						</>
					)}
				</div>

				{/* Vista previa */}
				{!resultados && currentTemplate && (
					<PreviewCard
						template={currentTemplate}
						variableValues={variableValues}
						recipients={recipients}
					/>
				)}
			</div>

			{/* Modal para crear plantilla */}
			{showCreateModal && (
				<CreateTemplateModal
					onClose={() => setShowCreateModal(false)}
					onSuccess={handleCreateTemplate}
				/>
			)}
		</div>
	);
};
