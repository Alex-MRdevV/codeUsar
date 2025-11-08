import { StatCard } from "@/components/historial/statCards";
import type { StatsOverviewProps } from "@/utils/types/historial";

export const StatsOverview = ({ data, config }: StatsOverviewProps) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{config.map((cardConfig, index) => {
				// Obtener el valor del data usando el key especificado
				const value = typeof cardConfig.value === 'string'
					? data[cardConfig.value]
					: cardConfig.value;

				// Formatear el valor si es un número
				const formattedValue = typeof value === 'number'
					? value.toLocaleString()
					: value?.toString() || '';

				return (
					<StatCard
						key={index}
						label={cardConfig.label}
						value={formattedValue}
						icon={cardConfig.icon}
						trend={cardConfig.trend}
						description={cardConfig.description}
						trendColor={cardConfig.trendColor}
					/>
				);
			})}
		</div>
	);
};
