import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AddMessageFormProps } from "@/utils/types/send";
import { FileText, MessageSquare } from "lucide-react";

export const TemplateSelector = ({
	templates,
	selectedTemplate,
	currentTemplate,
	handleTemplateChange,
	isRutaTemplate
}: {
	templates: AddMessageFormProps['templates'];
	selectedTemplate: string | null;
	currentTemplate: AddMessageFormProps['currentTemplate'];
	handleTemplateChange: (value: string) => void;
	isRutaTemplate: boolean;
}) => {
	if (templates.length === 0) return null;

	return (
		<section className="space-y-2">
			<Label className="flex items-center gap-1.5 text-sm font-medium">
				<FileText className="w-3.5 h-3.5 text-primary" />
				Plantilla
			</Label>

			<Select
				value={selectedTemplate || "manual"}
				onValueChange={handleTemplateChange}
			>
				<SelectTrigger className="bg-background border-input hover:bg-accent/50 transition-colors">
					<SelectValue placeholder="Selecciona una plantilla" />
				</SelectTrigger>

				<SelectContent>
					<SelectItem value="manual">
						<span className="flex items-center gap-2">
							<MessageSquare className="w-4 h-4 text-muted-foreground" />
							Escribir manualmente
						</span>
					</SelectItem>

					{templates.map((template) => (
						<SelectItem key={template.id} value={template.id}>
							<span className="flex items-center gap-2">
								<FileText className="w-4 h-4 text-muted-foreground" />
								{template.name}
							</span>
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{currentTemplate && (
				<div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-md bg-muted/30 border border-border/50">
					<span className="text-lg">📌</span>
					<p className="text-xs text-muted-foreground">
						Tipo: <span className="font-medium text-foreground">
							{isRutaTemplate ? "Confirmación en ruta" : "Plantilla general"}
						</span>
					</p>
				</div>
			)}
		</section>
	);
};
