import { MetricCard } from "@/components/historialGeneral/metricCard";
import { TemplateStatsCard } from "@/components/historialGeneral/templateStatsCard";
import { TrendChart } from "@/components/historialGeneral/trendChart";
import type { MetricCardSectionProps } from "@/utils/types/history";
import { Calendar, FileText, MessageSquare } from "lucide-react";
import { CalendarHeatmap } from "../calendarHeatmap";

export const MetricCardSection = ({
	templatesData,
	totalMessages,
	heatmapData = [],
	trendData = [],
	totalTrend
}: MetricCardSectionProps) => {
	return (
		<>
			<section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<MetricCard
					title="Total de Mensajes"
					value={totalMessages.toLocaleString()}
					icon={MessageSquare}
					trend={totalTrend}
					gradient="primary"
				/>
				<MetricCard
					title="Templates Activos"
					value={templatesData.length}
					icon={FileText}
					gradient="warm"
				/>
			</section>

			{(heatmapData.length > 0 || trendData.length > 0) && (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					{trendData.length > 0 && <TrendChart data={trendData} />}
					<CalendarHeatmap data={heatmapData} />
				</div>
			)}

			{/* Templates Section */}
			{templatesData.length > 0 && (
				<section>
					<div className="flex items-center gap-2 mb-6">
						<Calendar className="h-6 w-6 text-primary" />
						<h2 className="text-2xl font-display font-bold">Estadísticas por Template</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{templatesData.map((template) => (
							<TemplateStatsCard
								key={template.id}
								color={template.color}
								icon={template.icon}
								id={template.id}
								messagesSent={template.messagesSent}
								name={template.name}
								status={template.status}
							/>
						))}
					</div>
				</section>
			)}
		</>
	);
};
