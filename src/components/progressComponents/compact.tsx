import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { statusConfig, type BatchProgressVersionCompact } from "@/utils/types/progress"
import { Pause, Play, RotateCcw, Square } from "lucide-react"

export const ProgressComponentCompact = ({ status, completed, error, isCancelled, isProcessing, progress, className, onCancel, onReset, isPaused, onPause, onResume, showCancelButton }: BatchProgressVersionCompact) => {
	const config = statusConfig[status]
	const Icon = config.icon
	const roundedProgress = Math.round(progress)

	return (
		<article className={cn("flex items-center gap-3 p-3 rounded-lg border bg-card", className)}>
			<div className={cn("flex items-center justify-center size-8 rounded-full shrink-0", config.bgColor)}>
				<Icon className={cn("size-4", config.color, status === "processing" && "animate-spin")} />
			</div>

			<div className="flex-1 min-w-0">
				<div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
					<div
						className={cn("h-full transition-all duration-300 ease-out rounded-full", config.progressColor)}
						style={{ width: `${roundedProgress}%` }}
					/>
				</div>
			</div>

			<span className={cn("text-sm font-medium tabular-nums", config.color)}>{roundedProgress}%</span>

			{(isProcessing || isPaused) && onPause && onResume && (
				<Button size="icon" variant="ghost" onClick={isPaused ? onResume : onPause} className="size-8 shrink-0">
					{isPaused ? <Play className="size-3" /> : <Pause className="size-3" />}
				</Button>
			)}

			{(isProcessing || isPaused) && showCancelButton && onCancel && (
				<Button size="icon" variant="ghost" onClick={onCancel} className="size-8 shrink-0">
					<Square className="size-3" />
				</Button>
			)}

			{(completed || isCancelled || error) && onReset && (
				<Button size="icon" variant="ghost" onClick={onReset} className="size-8 shrink-0">
					<RotateCcw className="size-3" />
				</Button>
			)}
		</article>
	)
}
