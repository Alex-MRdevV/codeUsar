import { Button } from "@/components/ui/button";
import { RefreshCw, Save } from "lucide-react";

export const ActionButtons = ({
	canSave,
	validFilesCount,
	isProcessing,
	uploadedCount,
	onSaveAll,
	onReset,
}: {
	canSave: boolean;
	validFilesCount: number;
	isProcessing: boolean;
	uploadedCount: number;
	onSaveAll: () => void;
	onReset: () => void;
}) => (
	<section className="flex flex-col sm:flex-row gap-3 pt-4">
		<Button
			onClick={onSaveAll}
			disabled={!canSave}
			className="flex-1 sm:flex-initial"
			size="lg"
		>
			<Save className="mr-2 h-4 w-4" />
			Guardar Todo ({validFilesCount} archivos)
		</Button>

		<Button
			onClick={onReset}
			variant="outline"
			disabled={isProcessing || uploadedCount === 0}
			className="flex-1 sm:flex-initial"
			size="lg"
		>
			<RefreshCw className="mr-2 h-4 w-4" />
			Reiniciar
		</Button>
	</section>
);
