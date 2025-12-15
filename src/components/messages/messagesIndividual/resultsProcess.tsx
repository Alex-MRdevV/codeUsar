import { PreviewCardContainer } from "@/components/messages/messagesIndividual/previewContainer";
import { ProgressComponent } from "@/components/progress";
import type { PreviewSectionProps } from "@/utils/types/send";

export const ProcessResults = ({ cancel, completed, currentBatch, currentTemplate, error, isCancelled, isPaused, isProcessing, pause, progress, recipients, reset, resultados, resume, totalBatches }: PreviewSectionProps) => {
	return (
		<section className="space-y-4">
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
				<div className="sticky top-4">
					<PreviewCardContainer
						recipients={recipients}
						template={currentTemplate}
					/>
				</div>
			)}
		</section>
	)
}
