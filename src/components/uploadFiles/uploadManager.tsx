import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplatePreview } from "@/components/uploadFiles/previewTemplates";
import { UploadProgress } from "@/components/uploadFiles/progress";
import { FileUploadZone } from "@/components/uploadFiles/uploadZone";
import { useBatchSender } from "@/hooks/common/use-batchSender";
import { useExcelUpload } from "@/hooks/use-excelUpload";
import { RefreshCw, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const ExcelUploadManager = () => {
	const { fileTypes, uploadedFiles, uploadFile, removeFile, clearAll, getAllData } = useExcelUpload();
	const { progress, isProcessing, completed, currentBatch, totalBatches, sendInBatches, reset } = useBatchSender(10);
	const [currentProcessingFile, setCurrentProcessingFile] = useState<string>("");

	const handleFileSelect = async (file: File, fileTypeId: string) => {
		const fileType = fileTypes.find((ft) => ft.id === fileTypeId);
		if (!fileType) return;

		try {
			const uploadedFile = await uploadFile(file, fileType);
			if (uploadedFile.isValid) {
				toast.success(`${fileType.name} cargado correctamente`, {
					description: `${uploadedFile.data.length} registros encontrados`,
				});
			} else {
				toast.error(`Error al cargar ${fileType.name}`, {
					description: uploadedFile.errors.join(", "),
				});
			}
		} catch (error) {
			toast.error("Error al procesar el archivo", {
				description: "Verifica que el archivo sea un Excel válido",
			});
		}
	};

	const handleSaveAll = async () => {
		const allData = getAllData();
		const fileKeys = Object.keys(allData);

		if (fileKeys.length === 0) {
			toast.error("No hay archivos válidos para guardar");
			return;
		}
		reset();

		try {
			for (const key of fileKeys) {
				const fileType = fileTypes.find((ft) => ft.id === key);
				setCurrentProcessingFile(fileType?.name || key);

				//validador envolvió el payload en un array, así que:
				const payload = allData[key][0];
				// estos son los registros validados del backend
				const registros = payload?.data ?? [];

				if (!Array.isArray(registros) || registros.length === 0) continue;
				await sendInBatches(
					registros,
					async (batch) => {
						// Aquí harías la petición real de guardado
						console.log(`Guardando lote de ${key}:`, batch);
						await new Promise((resolve) => setTimeout(resolve, 500));
					},
					500
				);
			}

			toast.success("Todos los archivos se guardaron correctamente");
		} catch (error) {
			toast.error("Error al guardar los archivos");
		}
	};

	const handleReset = () => {
		clearAll();
		reset();
		setCurrentProcessingFile("");
		toast.info("Todos los archivos han sido eliminados");
	};

	const validFilesCount = Array.from(uploadedFiles.values()).filter((f) => f.isValid).length;
	const canSave = validFilesCount > 0 && !isProcessing;

	return (
		<article className="space-y-6">
			<section className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight text-foreground">
					Carga la plantilla de Excel
				</h1>
				<p className="text-muted-foreground">
					Sube la plantilla de la mensajería, la cual está enfocada para el buen funcionamiento de la app
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
								onFileSelect={(file) => handleFileSelect(file, fileType.id)}
								onRemove={() => removeFile(fileType.id)}
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
					onClick={handleSaveAll}
					disabled={!canSave}
					className="flex-1 sm:flex-initial"
					size="lg"
				>
					<Save className="mr-2 h-4 w-4" />
					Guardar Todo ({validFilesCount} archivos)
				</Button>

				<Button
					onClick={handleReset}
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
}
