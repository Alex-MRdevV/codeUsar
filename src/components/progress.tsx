import { ProgressComponentCompact } from "@/components/progressComponents/compact"
import { ProgressVersionCompleta } from "@/components/progressComponents/completo"
import { type BatchProgressProps } from "@/utils/types/progress"

export const ProgressComponent = ({ error, isCancelled, completed, isProcessing, progress, compact, currentBatch, totalBatches, className, onCancel, onReset, title, isPaused, onPause, onResume, showCancelButton }: BatchProgressProps) => {
	const getStatus = () => {
		if (error) return "error"
		if (isCancelled) return "cancelled"
		if (completed) return "completed"
		if (isProcessing) return "processing"
		return "idle"
	}
	const status = getStatus()

	return compact
		? <ProgressComponentCompact
			completed={completed}
			error={error}
			isCancelled={isCancelled}
			isProcessing={isProcessing}
			progress={progress}
			status={status}
			className={className}
			isPaused={isPaused}
			onCancel={onCancel}
			onPause={onPause}
			onReset={onReset}
			onResume={onResume}
			showCancelButton={showCancelButton}
		/>
		: <ProgressVersionCompleta
			completed={completed}
			currentBatch={currentBatch}
			error={error}
			isCancelled={isCancelled}
			isProcessing={isProcessing}
			progress={progress}
			status={status}
			totalBatches={totalBatches}
			className={className}
			onCancel={onCancel}
			onReset={onReset}
			title={title}
			isPaused={isPaused}
			onPause={onPause}
			onResume={onResume}
			showCancelButton={showCancelButton}
		/>;
}
