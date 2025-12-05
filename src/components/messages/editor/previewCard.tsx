import { type PreviewCardProps } from "@/utils/types/templates";

export const PreviewCard = ({
	template,
	recipients,
	getTotalCharacters,
	processText,
	setShowExamples,
	showExamples
}: PreviewCardProps) => {
	const { structure, variables } = template;
	return (
		<article className="bg-card border-border p-6 h-fit">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-sm font-semibold text-foreground">Vista Previa</h3>

				{/* Toggle para mostrar ejemplos */}
				{variables && variables.params.length > 0 && (
					<button
						onClick={() => setShowExamples(!showExamples)}
						className="text-xs text-muted-foreground hover:text-foreground transition-colors"
					>
						{showExamples ? 'Mostrar placeholders' : 'Mostrar ejemplos'}
					</button>
				)}
			</div>

			{/* Preview del mensaje */}
			<section
				className="bg-muted/30 rounded-lg p-4 min-h-40 max-h-60 overflow-y-auto"
				style={{ wordBreak: "break-word" }}
			>
				<section className="space-y-3">
					{/* Header */}
					{structure?.header?.text && (
						<div className="font-bold text-foreground text-base mb-3">
							{processText(structure.header.text, 'header')}
						</div>
					)}

					{/* Body */}
					{structure?.body?.text && (
						<p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
							{processText(structure?.body.text, 'body')}
						</p>
					)}

					{/* Footer */}
					{structure?.footer?.text && (
						<div className="text-muted-foreground text-xs mt-3 pt-3 border-t border-border/50">
							{processText(structure.footer.text, 'footer')}
						</div>
					)}
				</section>
			</section>

			{/* Variables Info */}
			{variables && variables.params.length > 0 && (
				<section className="mt-4 p-3 bg-muted/20 rounded-lg">
					<p className="text-xs font-semibold text-foreground mb-2">
						Variables detectadas:
					</p>
					<section className="space-y-1">
						{variables.params.map((param, index) => (
							<div
								key={index}
								className="flex items-center justify-between text-xs"
							>
								<span className="text-muted-foreground">
									{variables.format === 'named'
										? `{{${param.name}}}`
										: `{{${index + 1}}}`
									}
								</span>
								<span className="text-foreground font-mono">
									{param.placeholder}
								</span>
							</div>
						))}
					</section>
				</section>
			)}

			{/* Información del envío */}
			<section className="mt-6 pt-4 border-t border-border">
				<p className="text-xs text-muted-foreground mb-2">Información del envío:</p>
				<ul className="space-y-2 text-xs text-foreground">
					<li className="flex justify-between">
						<span>Destinatarios:</span>
						<span className="font-semibold">{recipients.length}</span>
					</li>
					<li className="flex justify-between">
						<span>Caracteres:</span>
						<span className="font-semibold">{getTotalCharacters()}</span>
					</li>
					{variables && (
						<li className="flex justify-between">
							<span>Variables:</span>
							<span className="font-semibold">{variables.params.length}</span>
						</li>
					)}
				</ul>
			</section>
		</article>
	);
};
