import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, MessageSquare, Phone, Plus, Sparkles, User } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useSendMessagesLogic } from "@/hooks/use-sendMessages";
import type { AddMessageFormProps, clientsInRuta, dataUsar } from "@/utils/types/messages";

export const AddMessageForm = ({
	templates = []
}: AddMessageFormProps) => {
	const [manualMessages, setManualMessages] = useState<dataUsar[]>([]);
	const [dataClientsRuta, setDataClientsRuta] = useState<clientsInRuta[]>([]);
	const [phone, setPhone] = useState("");
	const [name, setName] = useState("");
	const [content, setContent] = useState("");
	const [selectedTemplate, setSelectedTemplate] = useState<string>("");
	const [variableValues, setVariableValues] = useState<Record<string, string>>({});

	const currentTemplate = useMemo(
		() => templates.find((t) => t.id === selectedTemplate) || null,
		[templates, selectedTemplate]
	);

	const hasVariables = useMemo(() => {
		return (
			currentTemplate?.variables?.params &&
			currentTemplate.variables.params.length > 0
		);
	}, [currentTemplate]);

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
		flyingMessages,
	} = useSendMessagesLogic({
		currentTemplate,
		dataClientesRuta: dataClientsRuta,
		dataMensajes: manualMessages,
		selectedTemplate,
		variableValues,
	});

	const handleTemplateChange = (templateId: string) => {
		if (templateId === "manual") {
			setSelectedTemplate("");
			setContent("");
			setVariableValues({});
		} else {
			setSelectedTemplate(templateId);
			setVariableValues({});
		}
	};

	// Cuando cambia una variable
	const handleVariableChange = (varName: string, value: string) => {
		setVariableValues((prev) => ({
			...prev,
			[varName]: value,
		}));
	};

	return (
		<Card className="bg-card border-border shadow-card">
			<CardHeader className="pb-4">
				<CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
					<Plus className="w-5 h-5 text-primary" />
					Agregar Mensaje
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form className="space-y-4">
					{/* Selector de plantilla */}
					{templates.length > 0 && (
						<div className="space-y-2">
							<Label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
								<FileText className="w-3.5 h-3.5 text-primary" />
								Plantilla
							</Label>
							<Select
								value={selectedTemplate || "manual"}
								onValueChange={handleTemplateChange}
							>
								<SelectTrigger className="bg-background border-input">
									<SelectValue placeholder="Selecciona una plantilla" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="manual">
										<span className="flex items-center gap-2">
											<MessageSquare className="w-4 h-4" />
											Escribir manualmente
										</span>
									</SelectItem>
									{templates.map((template) => (
										<SelectItem key={template.id} value={template.id}>
											<span className="flex items-center gap-2">
												<FileText className="w-4 h-4" />
												{template.name}
											</span>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}

					{/* Variables de la plantilla */}
					{currentTemplate && hasVariables && currentTemplate.variables?.params && (
						<div className="space-y-3 p-3 rounded-lg bg-muted/50 border border-border">
							<div className="flex items-center gap-2">
								<Sparkles className="w-4 h-4 text-primary" />
								<span className="text-sm font-medium text-foreground">
									Variables de la plantilla
								</span>
								<Badge variant="secondary" className="text-xs">
									{currentTemplate.variables.params.length} variable(s)
								</Badge>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{currentTemplate.variables.params.map((param, index) => (
									<div key={param.name} className="space-y-1">
										<Label className="text-xs text-muted-foreground">
											<span className="font-mono text-primary">{`{{${index + 1}}}`}</span>{" "}
											{param.name}
										</Label>
										<Input
											placeholder={param.example || `Valor para ${param.name}`}
											value={variableValues[param.name] || ""}
											onChange={(e) => handleVariableChange(param.name, e.target.value)}
											className="bg-background border-input text-sm h-9"
										/>
									</div>
								))}
							</div>
						</div>
					)}

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="phone" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
								<Phone className="w-3.5 h-3.5 text-primary" />
								Teléfono *
							</Label>
							<Input
								id="phone"
								type="tel"
								placeholder="+52 123 456 7890"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								className="bg-background border-input focus:ring-primary"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="name" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
								<User className="w-3.5 h-3.5 text-muted-foreground" />
								Nombre (opcional)
							</Label>
							<Input
								id="name"
								type="text"
								placeholder="Nombre del contacto"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="bg-background border-input focus:ring-primary"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="content" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
							<MessageSquare className="w-3.5 h-3.5 text-primary" />
							Mensaje *
							{currentTemplate && (
								<Badge variant="outline" className="text-xs ml-auto">
									Usando: {currentTemplate.name}
								</Badge>
							)}
						</Label>
						<Textarea
							id="content"
							placeholder="Escribe el contenido del mensaje..."
							value={content}
							onChange={(e) => setContent(e.target.value)}
							className="bg-background border-input focus:ring-primary min-h-[100px] resize-none"
						/>
					</div>

					<Button
						type="submit"
						className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
					>
						<Plus className="w-4 h-4 mr-2" />
						Agregar a la lista
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};
