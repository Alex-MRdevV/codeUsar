import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { TemplateStats } from "@/utils/types/history";
import * as Icons from "lucide-react";
import { type LucideIcon } from "lucide-react";

export const TemplateStatsCard = ({
	name,
	icon,
	color,
	status,
	messagesSent
}: TemplateStats) => {
	// Get icon component dynamically
	const IconComponent = (Icons[icon as keyof typeof Icons] as LucideIcon) || Icons.FileText;

	const statusColors = {
		APPROVED: "bg-primary/10 text-primary border-primary/20",
		PENDING: "bg-accent/10 text-accent border-accent/20",
		REJECTED: "bg-destructive/10 text-destructive border-destructive/20",
	};

	return (
		<Card className="shadow-elegant border-border/50 transition-smooth hover:shadow-lg hover:scale-[1.02] group">
			<CardContent className="p-6">
				<div className="flex items-start gap-4">
					<div
						className="p-3 rounded-xl transition-smooth group-hover:scale-110"
						style={{
							backgroundColor: color ? `${color}20` : 'hsl(var(--primary) / 0.1)',
						}}
					>
						<IconComponent
							className="h-6 w-6"
							style={{ color: color || 'hsl(var(--primary))' }}
						/>
					</div>
					<div className="flex-1 space-y-3">
						<div className="flex items-start justify-between gap-2">
							<h4 className="font-display font-semibold text-lg leading-tight">{name}</h4>
							<Badge
								variant="outline"
								className={`text-xs ${statusColors[status]}`}
							>
								{status}
							</Badge>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-xs text-muted-foreground mb-1">Mensajes enviados</p>
								<p className="text-2xl font-display font-bold">{messagesSent.toLocaleString()}</p>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
