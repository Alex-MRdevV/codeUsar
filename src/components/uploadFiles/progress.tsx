import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { UploadProgressProps } from "@/utils/types/file";
import { CheckCircle2, Loader2 } from "lucide-react";

export const UploadProgress = ({
	progress,
	isProcessing,
	completed,
	currentBatch,
	totalBatches,
	currentFile,
}: UploadProgressProps) => {
	if (!isProcessing && !completed) return null;

	return (
		<Card className="border-primary/20 bg-card">
			<CardHeader className="pb-3">
				<CardTitle className="text-lg flex items-center gap-2">
					{completed ? (
						<>
							<CheckCircle2 className="h-5 w-5 text-success" />
							<span>¡Carga completada!</span>
						</>
					) : (
						<>
							<Loader2 className="h-5 w-5 animate-spin text-primary" />
							<span>Procesando archivos...</span>
						</>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{currentFile && (
					<div className="text-sm text-muted-foreground">
						Procesando: <span className="font-medium text-foreground">{currentFile}</span>
					</div>
				)}

				<section className="space-y-2">
					<div className="flex justify-between text-sm">
						<span className="text-muted-foreground">Progreso general</span>
						<span className="font-medium text-foreground">{Math.round(progress)}%</span>
					</div>
					<Progress
						value={progress}
						className={cn(
							"h-3",
							completed && "bg-success/20"
						)}
					/>
				</section>

				{totalBatches > 0 && (
					<div className="flex justify-between text-xs text-muted-foreground">
						<span>Lote {currentBatch} de {totalBatches}</span>
						<span>{completed ? "Finalizado" : "En proceso"}</span>
					</div>
				)}

				{completed && (
					<div className="rounded-lg bg-success/10 border border-success/20 p-3 text-sm text-success-foreground">
						Todos los archivos se han procesado correctamente
					</div>
				)}
			</CardContent>
		</Card>
	);
}
