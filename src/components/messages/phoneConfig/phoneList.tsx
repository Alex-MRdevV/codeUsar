import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PropsListPhone } from "@/utils/types/message";
import { Copy } from "lucide-react";

export const PhoneList = ({ phonesArray, selectedId, onSelectPhone, onCopyPhone }: PropsListPhone) => {
	const typeColors = {
		production: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
		preview: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
		development: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
	};

	const typeLabels = {
		production: "Producción",
		preview: "Vista Previa",
		development: "Desarrollo/Prueba",
	};

	return (
		<>
			{["production", "preview", "development"].map((type) => {
				const typePhones = phonesArray.filter((p) => p.type === type);
				if (typePhones.length === 0) return null;

				return (
					<div key={type}>
						<h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
							<div
								className={`w-3 h-3 rounded-full ${type === "production"
									? "bg-green-500"
									: type === "preview"
										? "bg-blue-500"
										: "bg-orange-500"
									}`}
							/>
							{typeLabels[type as keyof typeof typeLabels]}
						</h3>

						<div className="space-y-3">
							{typePhones.map((phone) => (
								<Card
									key={phone.id}
									className={cn(
										"bg-card border-border p-4 transition-all cursor-pointer hover:border-primary/50",
										phone.id === selectedId && "border-primary/50 bg-primary/5",
									)}
									onClick={() => onSelectPhone(phone.id)}
								>
									<div className="flex items-center justify-between gap-4">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												<h4 className="font-semibold text-foreground">{phone.name}</h4>
												<Badge variant="secondary" className={typeColors[phone.type]}>
													{phone.type === "production"
														? "Producción"
														: phone.type === "preview"
															? "Preview"
															: "Desarrollo"}
												</Badge>
												{phone.id === selectedId && (
													<Badge className="bg-green-600 text-white dark:bg-green-700">Activo</Badge>
												)}
											</div>
											<div className="font-mono text-sm text-muted-foreground">{phone.number}</div>
										</div>

										<div className="flex items-center gap-2">
											<Button
												variant="ghost"
												size="sm"
												onClick={(e) => {
													e.stopPropagation();
													onCopyPhone(phone.number);
												}}
												className="text-muted-foreground hover:text-foreground"
											>
												<Copy className="w-4 h-4" />
											</Button>
										</div>
									</div>
								</Card>
							))}
						</div>
					</div>
				);
			})}
		</>
	);
};
