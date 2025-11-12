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
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold text-foreground">
					Personalizar Variables
				</h3>
				<span className="text-xs text-muted-foreground">
					Formato: {variables.format === 'named' ? 'Nombrado' : 'Posicional'}
				</span>
			</div>

			<div className="space-y-4">
				{variables.params.map((param, index) => {
					const hasValue = values[param.name]?.trim();

					return (
						<div key={index} className="space-y-2">
							<label className="text-sm font-medium text-foreground flex items-center gap-2">
								<span className="font-mono text-xs px-2 py-1 bg-muted rounded">
									{variables.format === 'named'
										? `{{${param.name}}}`
										: `{{${index + 1}}}`
									}
								</span>
								<span>{param.placeholder}</span>
								{!hasValue && (
									<span className="text-red-500 text-xs">*</span>
								)}
							</label>
							<input
								type="text"
								value={values[param.name] || ''}
								onChange={(e) => handleChange(param.name, e.target.value)}
								placeholder={param.example}
								className={`w-full px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all ${hasValue
									? 'border-border focus:ring-primary'
									: 'border-red-300 focus:ring-red-500'
									}`}
							/>
							<p className="text-xs text-muted-foreground flex items-center gap-1">
								<span>💡 Ejemplo:</span>
								<span className="font-medium">{param.example}</span>
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};
