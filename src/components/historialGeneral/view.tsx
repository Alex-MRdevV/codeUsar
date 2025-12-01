import { MetricCardSection } from "./sections/metricCards"

export const ViewHistoryGeneral = () => {
	return (
		<section className="container mx-auto px-4 py-8 max-w-7xl">
			{/* Metrics Grid */}
			<MetricCardSection
				templatesData={ }
				totalMessages={ }
				uniqueNumbers={ }
			/>
		</section>
	)
}
