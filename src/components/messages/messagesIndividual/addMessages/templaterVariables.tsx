import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AddMessageFormProps } from "@/utils/types/send";
import { Sparkles } from "lucide-react";

export const TemplateVariables = ({
	currentTemplate,
	variableValues,
	handleVariableChange
}: {
	currentTemplate: AddMessageFormProps['currentTemplate'];
	variableValues: Record<string, string>;
	handleVariableChange: (name: string, value: string) => void;
}) => {
	if (!currentTemplate?.variables?.params) return null;

	const params = currentTemplate.variables.params;

	return (
		<section className="space-y-3 p-4 rounded-lg bg-linear-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 border border-primary/20">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Sparkles className="w-4 h-4 text-primary" />
					<span className="text-sm font-semibold text-foreground">
						Variables de la plantilla
					</span>
				</div>
				<Badge variant="secondary" className="text-xs font-medium">
					{params.length} {params.length === 1 ? 'variable' : 'variables'}
				</Badge>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{params.map((param, index) => (
					<div key={param.name} className="space-y-1.5">
						<Label className="text-xs font-medium text-muted-foreground">
							<span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-[10px]">
								{`{{${index + 1}}}`}
							</span>{" "}
							{param.name}
						</Label>
						<Input
							placeholder={param.example ?? `Valor para ${param.name}`}
							value={variableValues[param.name] || ""}
							onChange={(e) => handleVariableChange(param.name, e.target.value)}
							className="bg-background border-input text-sm h-9 focus:ring-2 focus:ring-primary/20 transition-all"
						/>
					</div>
				))}
			</div>
		</section>
	);
};
