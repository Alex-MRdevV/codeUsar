import { CalendarHeatmap } from "@/components/historialGeneral/calendarHeatmap";
import { MetricCard } from "@/components/historialGeneral/metricCard";
import { TemplateStatsCard } from "@/components/historialGeneral/templateStatsCard";
import { TrendChart } from "@/components/historialGeneral/trendChart";
import type { TemplateStatsCardProps } from "@/utils/types/historyGeneral";
import { Calendar, FileText, MessageSquare, Users } from "lucide-react";

export interface MetricCardSectionProps {
	templatesData: TemplateStatsCardProps[]
	totalMessages: number
	uniqueNumbers: number
}

const mockHeatmapData = Array.from({ length: 84 }, (_, i) => {
	const date = new Date();
	date.setDate(date.getDate() - (83 - i));
	const count = Math.floor(Math.random() * 150);

	// Simular templates usados ese día
	const numTemplates = Math.min(Math.floor(Math.random() * 3) + 1, mockTemplates.length);
	const shuffled = [...mockTemplates].sort(() => 0.5 - Math.random());
	const templatesUsed = shuffled.slice(0, numTemplates).map(t => ({
		id: t.id,
		name: t.name,
		color: t.color,
		messagesSent: Math.floor(count / numTemplates) + Math.floor(Math.random() * 20),
	}));

	return {
		date: date.toISOString().split('T')[0],
		count,
		templates: templatesUsed,
		uniqueNumbers: Math.floor(count * 0.7) + Math.floor(Math.random() * 20),
	};
});

const mockTemplates = [
	{
		id: "1",
		name: "Bienvenida",
		icon: "MessageCircle",
		color: "#14B8A6",
		messagesSent: 1234,
		usageCount: 45,
		status: "APPROVED" as const,
	},
	{
		id: "2",
		name: "Recordatorio de Pago",
		icon: "DollarSign",
		color: "#F59E0B",
		messagesSent: 856,
		usageCount: 32,
		status: "APPROVED" as const,
	},
	{
		id: "3",
		name: "Confirmación de Cita",
		icon: "Calendar",
		color: "#8B5CF6",
		messagesSent: 642,
		usageCount: 28,
		status: "APPROVED" as const,
	},
	{
		id: "4",
		name: "Promoción Especial",
		icon: "Gift",
		color: "#EC4899",
		messagesSent: 423,
		usageCount: 15,
		status: "PENDING" as const,
	},
];

const mockTrendData = Array.from({ length: 30 }, (_, i) => {
	const date = new Date();
	date.setDate(date.getDate() - (29 - i));
	return {
		date: date.toLocaleDateString('es', { day: 'numeric', month: 'short' }),
		messages: Math.floor(Math.random() * 200) + 50,
	};
});

const totalMessages = mockTemplates.reduce((sum, t) => sum + t.messagesSent, 0);
const uniqueNumbers = 2847; // This would come from counting unique phone numbers

export const MetricCardSection = ({ templatesData, totalMessages, uniqueNumbers }: MetricCardSectionProps) => {
	return (
		<>
			<section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<MetricCard
					title="Total de Mensajes"
					value={totalMessages.toLocaleString()}
					icon={MessageSquare}
					trend={{ value: 12.5, isPositive: true }}
					gradient="primary"
				/>
				<MetricCard
					title="Templates Activos"
					value={templatesData.length}
					icon={FileText}
					gradient="warm"
				/>
				<MetricCard
					title="Números Únicos"
					value={uniqueNumbers.toLocaleString()}
					icon={Users}
					trend={{ value: 8.2, isPositive: true }}
					gradient="primary"
				/>
			</section>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
				<CalendarHeatmap data={mockHeatmapData} />
				<TrendChart data={mockTrendData} />
			</div>

			{/* Templates Section */}
			<section>
				<div className="flex items-center gap-2 mb-6">
					<Calendar className="h-6 w-6 text-primary" />
					<h2 className="text-2xl font-display font-bold">Estadísticas por Template</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{mockTemplates.map((template) => (
						<TemplateStatsCard key={template.id} {...template} />
					))}
				</div>
			</section>
		</>
	)
}
