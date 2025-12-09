import { Card, CardContent } from "@/components/ui/card";
import type { MetricCardProps } from "@/utils/types/historyGeneral";

export const MetricCard = ({ title, value, icon: Icon, trend, gradient = "primary" }: MetricCardProps) => {
	const iconBgClass = gradient === "primary"
		? "bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700"
		: "bg-gradient-to-br from-orange-500 to-pink-600 dark:from-orange-600 dark:to-pink-700";

	const shadowClass = gradient === "primary"
		? "shadow-lg shadow-blue-500/25 dark:shadow-blue-500/30"
		: "shadow-lg shadow-orange-500/25 dark:shadow-orange-500/30";

	return (
		<Card className="shadow-xl border-border/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:border-border/80 bg-linear-to-br from-background to-muted/20">
			<CardContent className="p-6">
				<section className="flex items-start justify-between gap-4">
					<section className="space-y-2 flex-1">
						<p className="text-sm font-semibold text-muted-foreground/80 uppercase tracking-wide">{title}</p>
						<h3 className="text-4xl font-display font-bold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text">{value}</h3>
						{trend && (
							<div className="flex items-center gap-1.5 pt-1">
								<span className={`inline-flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-full ${trend.isPositive
									? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
									: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
									}`}>
									{trend.isPositive ? "↑" : "↓"} {trend.isPositive ? "+" : ""}{trend.value}%
								</span>
								<span className="text-xs text-muted-foreground">vs último período</span>
							</div>
						)}
					</section>
					<div className={`p-4 rounded-2xl ${iconBgClass} ${shadowClass} transition-all duration-300 hover:scale-110 hover:rotate-3`}>
						<Icon className="h-6 w-6 text-white drop-shadow-lg" />
					</div>
				</section>
			</CardContent>
		</Card>
	);
}