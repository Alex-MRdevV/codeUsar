import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { TemplatePanelProps } from "@/utils/types/historyGeneral";
import { TrendingUp } from "lucide-react";

export const TemplateList = ({ templates }: TemplatePanelProps) => {
	if (!templates || !Array.isArray(templates)) return null;

	return (
		<article className="space-y-4">
			<section className="flex items-center justify-between">
				<h3 className="font-display font-semibold text-sm flex items-center gap-2">
					<TrendingUp className="h-4 w-4 text-primary" />
					Desglose por Plantilla
				</h3>
				<Badge variant="outline" className="font-display">
					{templates.length} plantillas
				</Badge>
			</section>

			{/* Visual Breakdown Bar */}
			<section className="h-3 rounded-full overflow-hidden flex bg-muted">
				{templates.map((template) => (
					<div
						key={template.id}
						className="h-full transition-all duration-500"
						style={{
							width: `${template.percentage}%`,
							backgroundColor: template.color,
						}}
					/>
				))}
			</section>

			{/* Template List */}
			<article className="space-y-3">
				{templates
					.sort((a, b) => b.messagesSent - a.messagesSent)
					.map((template, index) => (
						<div
							key={template.id}
							className="group relative flex items-center gap-4 p-3 rounded-xl bg-card hover:bg-muted/50 border border-border/50 hover:border-border transition-smooth"
						>
							{/* Rank Badge */}
							<div className="shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center">
								<span className="text-xs font-bold text-muted-foreground">
									{index + 1}
								</span>
							</div>

							{/* Color Indicator */}
							<div
								className="shrink-0 w-3 h-10 rounded-full"
								style={{ backgroundColor: template.color }}
							/>

							{/* Template Info */}
							<section className="flex-1 min-w-0">
								<div className="flex items-center justify-between mb-1">
									<p className="font-medium text-sm truncate">{template.name}</p>
									<div className="flex items-center gap-2">
										<span className="text-sm font-bold font-display">
											{template.messagesSent.toLocaleString()}
										</span>
										<Badge
											variant="secondary"
											className="text-xs"
											style={{
												backgroundColor: `${template.color}20`,
												color: template.color,
												borderColor: `${template.color}40`
											}}
										>
											{template.percentage.toFixed(1)}%
										</Badge>
									</div>
								</div>
								<Progress
									value={template.percentage}
									className="h-1.5"
									style={{
										'--progress-color': template.color
									} as React.CSSProperties}
								/>
							</section>
						</div>
					))}
			</article>
		</article>
	);
};