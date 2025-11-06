import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

export const GruposSection = (groups: string[]) => {
	return (
		<div className="mt-8">
			<h2 className="text-xl font-semibold text-foreground mb-4">Grupos de Distribución</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{groups.map((group, idx) => (
					<Card
						key={idx}
						className="bg-card border-border p-6 hover:border-primary/50 transition-colors duration-200 dark:bg-card-dark dark:border-border-dark"
					>
						<div className="flex items-start justify-between">
							<div>
								<h3 className="font-semibold text-foreground dark:text-foreground-dark mb-1">{group}</h3>
								<p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
									{Math.floor(Math.random() * 500) + 100} contactos
								</p>
							</div>
							<Users className="w-6 h-6 text-primary dark:text-primary-dark" />
						</div>
						<div className="mt-4 flex gap-2">
							<Button
								variant="ghost"
								size="sm"
								className="flex-1 text-xs text-foreground hover:bg-muted/50 dark:text-foreground-dark dark:hover:bg-muted-dark/50"
							>
								Ver
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="flex-1 text-xs text-foreground hover:bg-muted/50 dark:text-foreground-dark dark:hover:bg-muted-dark/50"
							>
								Editar
							</Button>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
};
