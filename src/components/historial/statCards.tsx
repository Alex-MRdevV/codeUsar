import type { StatCardProps } from "@/utils/types/historial"

export const StatCard = ({
	label,
	value,
	icon,
	trend,
	trendColor = "text-green-500",
	description,
}: StatCardProps) => {
	return (
		<section className="rounded-lg border border-border/60 bg-card p-6 hover:border-primary/40 transition-all duration-300 hover:shadow-md hover:shadow-primary/5">
			<section className="flex items-start justify-between">
				<div className="flex-1">
					<p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
					<p className="text-3xl font-bold text-foreground">{value}</p>
					{description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
					{trend && <p className={`text-xs font-semibold ${trendColor} mt-2`}>{trend}</p>}
				</div>
				<div className="text-3xl opacity-75">{icon}</div>
			</section>
		</section>
	)
}
