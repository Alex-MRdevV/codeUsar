import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PhoneNumber } from "@/stores/phone";
import { CheckCircle, Copy } from "lucide-react";

interface PropsSelectionNumbers {
	selectedPhone: PhoneNumber | null;
}

export const CurrentSelection = ({ selectedPhone }: PropsSelectionNumbers) => {
	const handleCopyPhone = (number: string) => {
		navigator.clipboard.writeText(number);
	};

	if (!selectedPhone) return null;

	return (
		<Card className="bg-card p-6 border-primary/30">
			<h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
				<CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
				Número Actualmente Seleccionado
			</h2>
			<div className="bg-background/50 p-4 rounded-lg">
				<div className="text-sm text-muted-foreground mb-1">Teléfono Activo</div>
				<div className="flex items-center justify-between">
					<div className="text-2xl font-bold text-foreground font-mono">
						{selectedPhone.number}
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleCopyPhone(selectedPhone.number)}
						className="gap-2"
					>
						<Copy className="w-4 h-4" />
						Copiar
					</Button>
				</div>
			</div>
		</Card>
	);
};
