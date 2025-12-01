import { ActionButtons } from "@/components/files/actionsButtons";
import { HeaderSection } from "@/components/files/header";
import { FileTabs } from "@/components/files/tabs";
import { ProgressComponent } from "@/components/progress";
import type { ExcelUploadViewProps } from "@/utils/types/files";

export const ExcelUploadView = (props: ExcelUploadViewProps) => {
	const {
		fileTypes,
		uploadedFiles,
		progress,
		isProcessing,
		completed,
		currentBatch,
		totalBatches,
		validFilesCount,
		canSave,
		onFileSelect,
		onRemoveFile,
		onSaveAll,
		onReset,
		errors
	} = props;

	return (
		<article className="space-y-6">
			<HeaderSection />

			<FileTabs
				fileTypes={fileTypes}
				uploadedFiles={uploadedFiles}
				isProcessing={isProcessing}
				onFileSelect={onFileSelect}
				onRemoveFile={onRemoveFile}
			/>

			{(isProcessing || completed) && (
				<ProgressComponent
					compact={false}
					title="Procesando archivos"
					progress={progress}
					isProcessing={isProcessing}
					completed={completed}
					currentBatch={currentBatch}
					totalBatches={totalBatches}
					error={errors}
					isCancelled={false}
					isPaused={false}
					showCancelButton={false}
					onReset={onReset}
				/>
			)}

			<ActionButtons
				canSave={canSave}
				validFilesCount={validFilesCount}
				isProcessing={isProcessing}
				uploadedCount={uploadedFiles.size}
				onSaveAll={onSaveAll}
				onReset={onReset}
			/>
		</article>
	);
};
