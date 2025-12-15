import { PreviewCardContainer } from "@/components/messages/editor/previewCardContainer";
import { ProgressComponent } from "@/components/progress";
import type { PreviewSectionProps } from "@/utils/types/send";

export const PreviewSection = ({ isProcessing, isPaused, completed, error, isCancelled, progress, currentBatch, totalBatches, cancel, pause, resume, reset, resultados, currentTemplate, recipients }: PreviewSectionProps) => {
	return (
		<section className="space-y-4 lg:col-span-1">
			{(isProcessing || isPaused || completed || error || isCancelled) && (
				<div className="sticky top-4">
					<ProgressComponent
						error={error}
						isCancelled={isCancelled}
						completed={completed}
						isProcessing={isProcessing}
						progress={progress}
						currentBatch={currentBatch}
						totalBatches={totalBatches}
						isPaused={isPaused}
						onCancel={cancel}
						onPause={pause}
						onResume={resume}
						onReset={reset}
						title="Envío de Mensajes"
						showCancelButton={true}
					/>
				</div>
			)}

			{!resultados && currentTemplate && (
				<div className="">
					<PreviewCardContainer
						recipients={recipients}
						template={currentTemplate}
					/>
				</div>
			)}
		</section>
	)
}
