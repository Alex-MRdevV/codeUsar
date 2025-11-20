import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplatePreview } from "@/components/uploadFiles/previewTemplates";
import { UploadProgress } from "@/components/uploadFiles/progress";
import { FileUploadZone } from "@/components/uploadFiles/uploadZone";
import type { ExcelUploadViewProps } from "@/utils/types/file";
import { RefreshCw, Save } from "lucide-react";

export const ExcelUploadView = ({
	fileTypes,
	uploadedFiles,
	progress,
	isProcessing,
	completed,
	currentBatch,
	totalBatches,
	currentProcessingFile,
	validFilesCount,
	canSave,
	onFileSelect,
	onRemoveFile,
	onSaveAll,
	onReset,
}: ExcelUploadViewProps) => {
	return (
		<article className="space-y-6">
			<section className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight text-foreground">
					Carga de Archivos Excel
				</h1>
				<p className="text-muted-foreground">
					Sube tus archivos Excel y procesa los datos de forma automática
				</p>
			</section>

			<Tabs defaultValue={fileTypes[0].id} className="space-y-6">
				<TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 bg-muted/50 p-1">
					{fileTypes.map((fileType) => {
						const uploaded = uploadedFiles.get(fileType.id);
						return (
							<TabsTrigger
								key={fileType.id}
								value={fileType.id}
								className="relative data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
							>
								{fileType.name}
								{uploaded?.isValid && (
									<span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-success" />
								)}
							</TabsTrigger>
						);
					})}
				</TabsList>

				{fileTypes.map((fileType) => (
					<TabsContent key={fileType.id} value={fileType.id} className="space-y-6">
						<section className="grid gap-6 lg:grid-cols-2">
							<TemplatePreview fileType={fileType} />
							<FileUploadZone
								fileType={fileType}
								uploadedFile={uploadedFiles.get(fileType.id)}
								onFileSelect={(file) => onFileSelect(file, fileType.id)}
								onRemove={() => onRemoveFile(fileType.id)}
								disabled={isProcessing}
							/>
						</section>
					</TabsContent>
				))}
			</Tabs>

			{(isProcessing || completed) && (
				<UploadProgress
					progress={progress}
					isProcessing={isProcessing}
					completed={completed}
					currentBatch={currentBatch}
					totalBatches={totalBatches}
					currentFile={currentProcessingFile}
				/>
			)}

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
					disabled={isProcessing || uploadedFiles.size === 0}
					className="flex-1 sm:flex-initial"
					size="lg"
				>
					<RefreshCw className="mr-2 h-4 w-4" />
					Reiniciar
				</Button>
			</section>
		</article>
	);
};
