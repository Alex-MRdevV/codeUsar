import type { TemplateCardProps } from "@/utils/types/historial"

export const TemplateCard = ({ template, percentage }: TemplateCardProps) => {
	return (
		<div className="group relative rounded-lg border border-border/60 bg-card p-6 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
			{/* Background gradient accent */}
			<div
				className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-5 bg-linear-to-br ${template.color} transition-opacity duration-300`}
			/>

			<div className="relative z-10">
				{/* Header with icon and name */}
				<div className="flex items-start justify-between mb-6">
					<div>
						<div className="text-5xl mb-3">{template.icon}</div>
						<h3 className="text-xl font-semibold text-foreground">{template.name}</h3>
					</div>
					<div
						className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br ${template.color} text-white font-bold text-sm`}
					>
						{percentage.toFixed(0)}%
					</div>
				</div>

				{/* Counter */}
				<div className="mb-6">
					<p className="text-4xl font-bold tracking-tight text-foreground">{template.count.toLocaleString()}</p>
					<p className="text-xs text-muted-foreground mt-1">mensajes enviados</p>
				</div>

				{/* Progress bar */}
				<div className="relative h-2 bg-secondary rounded-full overflow-hidden">
					<div
						className={`h-full rounded-full bg-linear-to-r ${template.color} transition-all duration-500`}
						style={{ width: `${percentage}%` }}
					/>
				</div>
			</div>
		</div>
	)
}
