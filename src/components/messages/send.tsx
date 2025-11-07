import { MessageInput } from "@/components/messages/input";
import { PreviewCard } from "@/components/messages/previewCard";
import { TemplateSelector } from "@/components/messages/templaterSelector";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";

export const SendMessages = () => {
	const [recipients, setRecipients] = useState<string[]>([]);
	const [selectedTemplate, setSelectedTemplate] = useState("");
	const [message, setMessage] = useState("");
	const [isSending, setIsSending] = useState(false);

	const handleSend = () => {
		if (message.trim() && recipients.length > 0) {
			setIsSending(true); // Cambia el estado a "Enviando..."
			console.log("Enviando mensajes:", {
				recipients,
				message,
				template: selectedTemplate,
			});
			// Aquí irá la integración con la API de Meta
			setTimeout(() => {
				setIsSending(false); // Simula el fin del envío
				alert("Mensajes enviados con éxito");
			}, 2000);
		}
	};

	const handleImportRecipients = (file: File) => {
		// Simula la carga de destinatarios desde un archivo
		const reader = new FileReader();
		reader.onload = (e) => {
			const content = e.target?.result as string;
			const importedRecipients = content.split("\n").map((line) => line.trim());
			setRecipients((prev) => [...prev, ...importedRecipients]);
		};
		reader.readAsText(file);
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
					<TemplateSelector
						value={selectedTemplate}
						onChange={(templateId) => {
							setSelectedTemplate(templateId);
							// Si se selecciona un template, puedes generar un mensaje predeterminado
							if (templateId === "welcome") {
								setMessage("¡Bienvenido a nuestro servicio! Estamos aquí para ayudarte.");
							} else if (templateId === "promo") {
								setMessage("¡Aprovecha nuestra promoción especial! Solo por tiempo limitado.");
							} else if (templateId === "reminder") {
								setMessage("Este es un recordatorio para tu próxima cita.");
							} else {
								setMessage(""); // Mensaje personalizado
							}
						}}
					/>
					<MessageInput message={message} onMessageChange={setMessage} />
					<div className="flex items-center gap-4">
						<label className="text-sm font-semibold text-foreground">Importar destinatarios:</label>
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
						onClick={handleSend}
						disabled={!message.trim() || recipients.length === 0 || isSending}
						className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-semibold gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
					>
						{isSending ? "Enviando..." : <Send className="w-5 h-5" />}
						{isSending ? "Enviando mensajes..." : `Enviar a ${recipients.length} contacto${recipients.length !== 1 ? "s" : ""}`}
					</Button>
				</div>

				{/* Preview */}
				<PreviewCard message={message} recipients={recipients} />
			</div>
		</div>
	);
};
