import { ButtonEnvio } from "@/components/messages/buttonEnvio";
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
		setVariableValues({}); // Reset variables al cambiar template
	};

	const handleSendMessage = () => {
		if (!currentTemplate) return;

		const datos: SendMessageRequest = {
			recipients: recipients,
			messageType: 'template',
			templateName: currentTemplate.metaTemplateName,
			templateParams: variableValues,
			templateLanguage: currentTemplate.language || 'es',
		};

		onSubmit(datos);
	};

	const handleCreateTemplate = async (newTemplate: Template) => {
		// Agregar la nueva plantilla a la lista local inmediatamente
		setTemplates(prev => [...prev, newTemplate]);
		setShowCreateModal(false);
	};

	// Validar si se puede enviar
	const canSend = () => {
		if (!selectedTemplate || recipients.length === 0 || isSubmitting) {
			return false;
		}

		// Verificar que todas las variables requeridas tengan valor
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
				{/* Main Form */}
				<div className="lg:col-span-2 space-y-6">
					{resultados ? (
						<div className="space-y-4">
							<ResultsCard
								resultados={resultados}
								onClose={handleNewSend}
							/>
							<Button
								onClick={handleNewSend}
								className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-semibold"
							>
								Enviar nuevos mensajes
							</Button>
						</div>
					) : (
						<>
							{/* Selector de Template */}
							<TemplateSelector
								value={selectedTemplate}
								templates={templates}
								onChange={handleTemplateChange}
							/>

							{/* Editor de Variables */}
							{currentTemplate?.variables && currentTemplate.variables.params.length > 0 && (
								<div className="bg-card border border-border rounded-lg p-6">
									<VariableEditor
										variables={currentTemplate.variables}
										values={variableValues}
										onChange={setVariableValues}
									/>
								</div>
							)}

							{/* Gestión de Destinatarios */}
							<div className="bg-card border border-border rounded-lg p-6">
								<h3 className="text-sm font-semibold text-foreground mb-4">
									Destinatarios
								</h3>

								<div className="space-y-4">
									<div className="flex items-center gap-4">
										<label className="text-sm font-medium text-foreground">
											Importar desde archivo:
										</label>
										<input
											type="file"
											accept=".csv,.txt"
											onChange={(e) => {
												if (e.target.files?.[0]) {
													handleImportRecipients(e.target.files[0]);
												}
											}}
											className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
										/>
									</div>

									{recipients.length > 0 && (
										<div className="p-3 bg-muted/20 rounded-lg">
											<p className="text-sm text-foreground">
												<span className="font-semibold">{recipients.length}</span> destinatario{recipients.length !== 1 ? 's' : ''} agregado{recipients.length !== 1 ? 's' : ''}
											</p>
										</div>
									)}
								</div>
							</div>

							{/* Botón de Envío */}
							<ButtonEnvio canSend={canSend} handleSendMessage={handleSendMessage} isSubmitting={isSubmitting} recipients={recipients} />

							{/* Mensaje de advertencia si faltan variables */}
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

				{/* Preview Card - Solo mostrar si no hay resultados */}
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
