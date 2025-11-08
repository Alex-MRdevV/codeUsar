import { ConfigurarSend } from "@/components/messages/configurarEnvio";
import { MessageInput } from "@/components/messages/input";
import { PreviewCard } from "@/components/messages/previewCard";
import { ResultsCard } from "@/components/messages/resultsCard";
import { TemplateSelector } from "@/components/messages/templaterSelector";
import { Button } from "@/components/ui/button";
import { sendWhatsAppMessage } from "@/lib/providersMensajes/callApi/useApi";
import type { SendMessageRequest } from "@/utils/types/providers/meta";
import { Send } from "lucide-react";
import { useState } from "react";

interface Props {
	templates: {
		id: string;
		name: string;
	}[];
	data: SendMessageRequest;
}

export const SendMessages = ({ templates, data }: Props) => {
	const [recipients, setRecipients] = useState<string[]>([]);
	const [selectedTemplate, setSelectedTemplate] = useState("");
	const [message, setMessage] = useState("");
	const { createHandler, resultados, resetResultados, isSubmitting } = ConfigurarSend();

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
		setMessage("");
		setSelectedTemplate("");
	};

	return (
		<div className="p-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-foreground mb-2">Enviar Mensajes</h1>
				<p className="text-muted-foreground">Crea y envía mensajes masivos a tus contactos</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Form */}
				<div className="lg:col-span-2 space-y-6">
					{/* Mostrar resultados si existen */}
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
							<TemplateSelector
								value={selectedTemplate}
								templates={templates}
								onChange={(templateId) => {
									setSelectedTemplate(templateId);
									if (templateId === "welcome") {
										setMessage("¡Bienvenido a nuestro servicio! Estamos aquí para ayudarte.");
									} else if (templateId === "promo") {
										setMessage("¡Aprovecha nuestra promoción especial! Solo por tiempo limitado.");
									} else if (templateId === "reminder") {
										setMessage("Este es un recordatorio para tu próxima cita.");
									} else {
										setMessage("");
									}
								}}
							/>

							<MessageInput message={message} onMessageChange={setMessage} />

							<div className="flex items-center gap-4">
								<label className="text-sm font-semibold text-foreground">
									Importar destinatarios:
								</label>
								<input
									type="file"
									accept=".csv,.txt"
									onChange={(e) => {
										if (e.target.files?.[0]) {
											handleImportRecipients(e.target.files[0]);
										}
									}}
									className="text-sm"
								/>
							</div>

							<Button
								onClick={() => {
									const datos: SendMessageRequest = {
										recipients: data.recipients,
										messageType: data.messageType,
										content: data.content as string,
										templateName: data.templateName,
										templateParams: data.templateParams,
									};
									onSubmit(datos);
								}}
								disabled={!message.trim() || recipients.length === 0 || isSubmitting}
								className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-semibold gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
							>
								{isSubmitting ? (
									<>
										<div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
										Enviando...
									</>
								) : (
									<>
										<Send className="w-5 h-5" />
										{`Enviar a ${recipients.length} contacto${recipients.length !== 1 ? "s" : ""}`}
									</>
								)}
							</Button>
						</>
					)}
				</div>

				{/* Preview Card - Solo mostrar si no hay resultados */}
				{!resultados && (
					<PreviewCard message={message} recipients={recipients} />
				)}
			</div>
		</div>
	);
};
