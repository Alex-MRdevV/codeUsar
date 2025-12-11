import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { AddMessageFormProps } from "@/utils/types/messages";
import { FileText, MessageSquare, Phone, Plus, Sparkles, User } from "lucide-react";

export const AddMessageFormComponent = ({
	templates,
	currentTemplate,
	selectedTemplate,
	handleTemplateChange,
	hasVariables,
	variableValues,
	handleVariableChange,
	content,
	setContent,
	name,
	setName,
	phone,
	setPhone,
	addClientToRuta,
	addManualMessage,
	addDataMessageTemplates,
}: AddMessageFormProps) => {
	const isRutaTemplate =
		currentTemplate?.metaTemplateName === "confirmacion_de_pedido";

	return (
		<Card className="bg-card border-border shadow-card">
			<CardHeader className="pb-4">
				<CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
					<Plus className="w-5 h-5 text-primary" />
					Agregar Mensaje
				</CardTitle>
			</CardHeader>

			<CardContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();

						addManualMessage();

						if (isRutaTemplate) {
							addClientToRuta(); // clientes_en_ruta
						} else {
							// CORRECCIÓN: Usar addDataMessageTemplates para plantillas generales
							addDataMessageTemplates(); // para dataUsar (resto de plantillas)
						}
					}}
					className="space-y-4"
				>
					{templates.length > 0 && (
						<section className="space-y-2">
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

							{/* Indicador de tipo */}
							{currentTemplate && (
								<p className="text-xs text-muted-foreground mt-1">
									📌 Tipo:{" "}
									{isRutaTemplate ? "confirmación en ruta" : "plantilla general"}
								</p>
							)}
						</section>
					)}

					{/* VARIABLES DE PLANTILLA */}
					{currentTemplate && hasVariables && currentTemplate.variables?.params && (
						<section className="space-y-3 p-3 rounded-lg bg-muted/50 border border-border">
							<div className="flex items-center gap-2">
								<Sparkles className="w-4 h-4 text-primary" />
								<span className="text-sm font-medium text-foreground">
									Variables de la plantilla
								</span>
								<Badge variant="secondary" className="text-xs">
									{currentTemplate.variables.params.length} variable(s)
								</Badge>
							</div>

							<section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{currentTemplate.variables.params.map((param, index) => (
									<div key={param.name} className="space-y-1">
										<Label className="text-xs text-muted-foreground">
											<span className="font-mono text-primary">{`{{${index + 1}}}`}</span>{" "}
											{param.name}
										</Label>
										<Input
											placeholder={param.example ?? `Valor para ${param.name}`}
											value={variableValues[param.name] || ""}
											onChange={(e) =>
												handleVariableChange(param.name, e.target.value)
											}
											className="bg-background border-input text-sm h-9"
										/>
									</div>
								))}
							</section>
						</section>
					)}

					{/* CAMPOS DE TELÉFONO Y NOMBRE */}
					<section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<section className="space-y-2">
							<Label htmlFor="phone" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
								<Phone className="w-3.5 h-3.5 text-primary" />
								Teléfono *
							</Label>

							<Input
								id="phone"
								type="tel"
								placeholder="+57 300 123 4567"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								className="bg-background border-input"
								required
							/>
						</section>

						<section className="space-y-2">
							<Label htmlFor="name" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
								<User className="w-3.5 h-3.5 text-muted-foreground" />
								Nombre (opcional)
							</Label>
							<Input
								id="name"
								type="text"
								placeholder="Nombre"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="bg-background border-input"
							/>
						</section>
					</section>

					{/* SOLO MENSAJE MANUAL */}
					<section className="space-y-2">
						<Label htmlFor="content" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
							<MessageSquare className="w-3.5 h-3.5 text-primary" />
							Mensaje *
						</Label>

						<Textarea
							id="content"
							placeholder="Escribe el contenido del mensaje..."
							value={content}
							onChange={(e) => setContent(e.target.value)}
							className="bg-background border-input min-h-[100px] resize-none"
						/>
					</section>

					<Button type="submit" className="w-full bg-primary hover:bg-primary/90">
						<Plus className="w-4 h-4 mr-2" />
						Agregar a la lista
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};
