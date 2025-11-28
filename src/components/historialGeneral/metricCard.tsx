import { Card, CardContent } from "@/components/ui/card";
import type { MetricCardProps } from "@/utils/types/historyGeneral";

export function MetricCard({ title, value, icon: Icon, trend, gradient = "primary" }: MetricCardProps) {
	return (
		<Card className="shadow-elegant border-border/50 overflow-hidden transition-smooth hover:shadow-lg">
			<CardContent className="p-6">
				<div className="flex items-start justify-between">
					<div className="space-y-1">
						<p className="text-sm font-medium text-muted-foreground">{title}</p>
						<h3 className="text-3xl font-display font-bold tracking-tight">{value}</h3>
						{trend && (
							<p className={`text-xs font-medium ${trend.isPositive ? "text-primary" : "text-destructive"}`}>
								{trend.isPositive ? "+" : ""}{trend.value}% vs last period
							</p>
						)}
					</div>
					<div className={`p-3 rounded-xl ${gradient === "primary" ? "gradient-primary" : "gradient-warm"} shadow-glow-primary`}>
						<Icon className="h-5 w-5 text-white" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
