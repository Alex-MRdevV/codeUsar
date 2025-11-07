
const templates = [
	{ id: "custom", name: "Personalizado" },
	{ id: "promo", name: "Promoción" },
	{ id: "reminder", name: "Recordatorio" },
	{ id: "welcome", name: "Bienvenida" },
];

interface TemplateSelectorProps {
	value: string;
	onChange: (templateId: string) => void;
}

export const TemplateSelector = ({ value, onChange }: TemplateSelectorProps) => {
	return (
		<article>
			<label className="text-sm font-semibold text-foreground mb-3 block">
				Plantilla
			</label>
			<section className="grid grid-cols-2 sm:grid-cols-4 gap-2">
				{templates.map((tmpl) => (
					<button
						key={tmpl.id}
						onClick={() => {
							onChange(tmpl.id);
						}}
						className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${value === tmpl.id
							? "bg-primary text-primary-foreground"
							: "bg-muted/30 text-foreground hover:bg-muted/50"
							}`}
					>
						{tmpl.name}
					</button>
				))}
			</section>
		</article>
	);
};
