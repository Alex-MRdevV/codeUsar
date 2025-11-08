import { StatsOverview } from "@/components/historial/statsOverview";
import { TemplateCard } from "@/components/historial/templateCard";
import type { HistorialAplicadoProps } from "@/utils/types/historial";

export const HistorialAplicado = ({ templates, statsConfig }: HistorialAplicadoProps) => {
	const totalMessages = templates.reduce((sum, t) => sum + t.count, 0);
	const mostUsed = templates.reduce((prev, current) =>
		(prev.count > current.count ? prev : current)
	);
	const averagePerTemplate = Math.round(totalMessages / templates.length);

	const statsData = {
		total: totalMessages,
		mostUsed: mostUsed.name,
		average: averagePerTemplate,
		templates: templates.length
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Stats Overview */}
				<StatsOverview config={statsConfig} data={statsData} />

				{/* Templates Grid */}
				<section className="mt-12">
					<h2 className="text-2xl font-bold tracking-tight mb-2">Plantillas</h2>
					<p className="text-gray-600 dark:text-gray-400 mb-8">
						Visualiza el uso de cada plantilla de mensajes
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{templates.map((template) => (
							<TemplateCard
								key={template.id}
								template={template}
								percentage={(template.count / totalMessages) * 100}
							/>
						))}
					</div>
				</section>
			</main>
		</div>
	);
};
