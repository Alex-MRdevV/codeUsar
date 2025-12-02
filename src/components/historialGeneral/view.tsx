import { getTemplatesForMetrics } from "@/utils/services/templates/allDataForMetrics";
import type { TemplateForMetrics } from "@/utils/types/templates";
import { useEffect, useState } from "react";
import { MetricCardSection } from "./sections/metricCards";

export const ViewHistoryGeneral = () => {
	const [data, setData] = useState<TemplateForMetrics[] | null>(null);
	const [error, setError] = useState<boolean>(false);

	useEffect(() => {
		let mounted = true;

		getTemplatesForMetrics().then(([err, templates]) => {
			if (!mounted) return;
			if (err) setError(true);
			else setData(templates);
		});

		return () => {
			mounted = false; // evita actualizaciones dobles
		};
	}, []);

	if (error) return <p>Error</p>;
	if (!data) return <p>Cargando...</p>;

	const totalMessages = data.reduce(
		(total: number, template: { messagesSent: number }) => total + template.messagesSent,
		0
	);

	return (
		<section className="container mx-auto px-4 py-8 max-w-7xl">
			<MetricCardSection
				templatesData={data}
				totalMessages={totalMessages}
			/>
		</section>
	)
}
