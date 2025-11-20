import { ExcelUploadView } from "@/components/uploadFiles/view";
import { useBatchSender } from "@/hooks/common/use-batchSender";
import { useExcelUpload } from "@/hooks/use-excelUpload";
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

				await sendInBatches(
					allData[key],
					async (batch) => {
						// Aquí implementarías la lógica para guardar cada lote
						// Por ejemplo: await api.saveData(key, batch);
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
		<ExcelUploadView
			fileTypes={fileTypes}
			uploadedFiles={uploadedFiles}
			progress={progress}
			isProcessing={isProcessing}
			completed={completed}
			currentBatch={currentBatch}
			totalBatches={totalBatches}
			currentProcessingFile={currentProcessingFile}
			validFilesCount={validFilesCount}
			canSave={canSave}
			onFileSelect={handleFileSelect}
			onRemoveFile={removeFile}
			onSaveAll={handleSaveAll}
			onReset={handleReset}
		/>
	);
};
