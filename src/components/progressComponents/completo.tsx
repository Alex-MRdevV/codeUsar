import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { statusConfig, type BatchProgressVersionCompleta } from "@/utils/types/progress"
import { Package, Pause, Play, RotateCcw, Square } from "lucide-react"

export const ProgressVersionCompleta = ({ completed, error, isCancelled, isProcessing, progress, status, className, isPaused, onCancel, onPause, onReset, onResume, showCancelButton, title, currentBatch, totalBatches }: BatchProgressVersionCompleta) => {
	const config = statusConfig[status]
	const Icon = config.icon
	const roundedProgress = Math.round(progress)

	return (
		<article className={cn("w-full p-4 rounded-xl border bg-card shadow-sm", className)}>
			{/* Header */}
			<div className="flex items-start justify-between gap-4 mb-4">
				<div className="flex items-center gap-3 min-w-0">
					<div className={cn("flex items-center justify-center size-10 rounded-lg shrink-0", config.bgColor)}>
						<Icon className={cn("size-5", config.color, status === "processing" && "animate-spin")} />
					</div>
					<div className="min-w-0">
						<h3 className="font-semibold text-card-foreground truncate">{title}</h3>
						<p className={cn("text-sm", config.color)}>{config.label}</p>
					</div>
				</div>

				{/* Percentage */}
				<div className={cn("text-2xl font-bold tabular-nums shrink-0", config.color)}>{roundedProgress}%</div>
			</div>

			{/* Progress bar */}
			<div className="h-3 w-full bg-secondary rounded-full overflow-hidden mb-3">
				<div
					className={cn(
						"h-full transition-all duration-300 ease-out rounded-full",
						config.progressColor,
						status === "processing" && "animate-pulse",
					)}
					style={{ width: `${roundedProgress}%` }}
				/>
			</div>

			{/* Footer */}
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-4 text-sm text-muted-foreground">
					{totalBatches > 0 && (
						<span className="flex items-center gap-1.5">
							<Package className="size-4" />
							<span className="tabular-nums">
								{currentBatch} / {totalBatches}
							</span>
							<span className="hidden sm:inline">lotes</span>
						</span>
					)}
					{error && <span className="text-destructive truncate max-w-[200px] sm:max-w-none">{error}</span>}
				</div>

				<div className="flex items-center gap-2 shrink-0">
					{(isProcessing || isPaused) && onPause && onResume && (
						<Button size="sm" variant="outline" onClick={isPaused ? onResume : onPause}>
							{isPaused ? (
								<>
									<Play className="size-3 mr-1.5" />
									Reanudar
								</>
							) : (
								<>
									<Pause className="size-3 mr-1.5" />
									Pausar
								</>
							)}
						</Button>
					)}

					{(isProcessing || isPaused) && showCancelButton && onCancel && (
						<Button size="sm" variant="outline" onClick={onCancel}>
							<Square className="size-3 mr-1.5" />
							Cancelar
						</Button>
					)}

					{(completed || isCancelled || error) && onReset && (
						<Button size="sm" variant="outline" onClick={onReset}>
							<RotateCcw className="size-3 mr-1.5" />
							Reiniciar
						</Button>
					)}
				</div>
			</div>
		</article>
	)
}
