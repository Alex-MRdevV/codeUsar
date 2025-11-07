interface MessageTemplatesProps {
	templates: string[];
	onSelectTemplate: (template: string) => void;
}

export default function MessageTemplates({ templates, onSelectTemplate }: MessageTemplatesProps) {
	return (
		<div className="bg-card border border-border rounded-xl p-6">
			<h2 className="text-lg font-semibold mb-4">Plantillas</h2>
			<div className="space-y-2">
				{templates.map((template, idx) => (
					<button
						key={idx}
						onClick={() => onSelectTemplate(template)}
						className="w-full text-left p-3 bg-border/30 hover:bg-border/50 rounded-lg transition-colors duration-200 text-sm"
					>
						{template}
					</button>
				))}
			</div>
		</div>
	);
}
