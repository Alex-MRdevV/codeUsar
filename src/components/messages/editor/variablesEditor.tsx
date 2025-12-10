import type { VariableEditorProps } from "@/utils/types/templates";

export const VariableEditor: React.FC<VariableEditorProps> = ({
	variables,
	values,
	onChange
}) => {
	const handleChange = (paramName: string, value: string) => {
		onChange({
			...values,
			[paramName]: value
		});
	};

	return (
		<div className="space-y-6">
			<header className="flex items-center justify-between">
				<h3 className="text-sm font-semibold text-foreground">
					Personalizar Variables
				</h3>

				<span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
					{variables.format === "named" ? "Variables Nombradas" : "Variables Posicionales"}
				</span>
			</header>

			<div className="space-y-6">
				{variables.params.map((param, index) => {
					const error = !values[param.name]?.trim();

					return (
						<div
							key={index}
							className="space-y-3 bg-muted/40 p-4 rounded-xl border border-border/50 shadow-sm"
						>
							<label className="text-sm font-medium text-foreground flex items-center gap-2">
								<span className="font-mono text-xs px-2 py-1 bg-background border rounded-lg">
									{variables.format === "named"
										? `{{${param.name}}}`
										: `{{${index + 1}}}`}
								</span>

								<span>{param.placeholder}</span>
								{error && <span className="text-red-500 text-xs">*</span>}
							</label>

							<input
								type="text"
								value={values[param.name] || ""}
								onChange={(e) => handleChange(param.name, e.target.value)}
								placeholder={param.example}
								className={`w-full px-3 py-2 text-sm rounded-lg bg-background border transition-all outline-none
									${error
										? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/40"
										: "border-border focus:border-primary focus:ring-2 focus:ring-primary/30"
									}`}
							/>

							<p className="text-xs text-muted-foreground flex items-center gap-1">
								<span className="opacity-80">💡 Ejemplo:</span>
								<span className="font-medium">{param.example}</span>
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};

