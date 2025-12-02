import { ExcelUploadView } from "@/components/files/viewUpload";
import { useBatchSender } from "@/hooks/common/use-senderBatch";
import { useExcelUpload } from "@/hooks/use-uploadFiles";
import { UploadBavariaNowRequest } from "@/utils/services/files/uploadavariaNowTemplate";
import { UploadConsolidadoRequest } from "@/utils/services/files/uploadConsolidado";
import { EXCEL_FILE_TYPES } from "@/utils/types/files";
import { use, useState } from "react";
import { toast } from "sonner";

export const ExcelUploadManager = () => {
	const {
		clearAll,
		uploadedFiles,
		removeFile,
		uploadFile,
		getAllFiles,
	} = useExcelUpload();

	const {
		completed,
		currentBatch,
		error,
		isProcessing,
		progress,
		reset,
		sendInBatches,
		totalBatches,
	} = useBatchSender<any>(1); // tamaño 1 porque enviamos archivo por archivo
	const [currentProcessingFile, setCurrentProcessingFile] = useState("");
	const handleFileSelect = async (file: File, fileTypeId: string) => {
		const fileType = fileTypes.find((ft) => ft.id === fileTypeId);
		if (!fileType) return;

		try {
			const uploadedFile = await uploadFile(file, fileType);

			if (uploadedFile.isValid) {
				toast.success(`${fileType.name} cargado`, {
					description: `${uploadedFile.data.length} registros encontrados`,
				});
			} else {
				toast.error(`Error al cargar ${fileType.name}`, {
					description: uploadedFile.errors.join(", "),
				});
			}
		} catch {
			toast.error("No se pudo procesar el archivo");
		}
	};

	const handleSaveAll = async () => {
		const filesMap = getAllFiles(); // aquí están los File originales
		const keys = Object.keys(filesMap);

		if (keys.length === 0) {
			toast.error("No hay archivos válidos");
			return;
		}

		reset();

		try {
			for (const key of keys) {
				const file = filesMap[key];
				const fileType = fileTypes.find((f) => f.id === key);
				const name = fileType?.name ?? key;

				setCurrentProcessingFile(name);

				// Selección de API según el fileType
				const apiFn =
					key === fileTypes[0].id
						? UploadConsolidadoRequest
						: UploadBavariaNowRequest;

				// Esto ejecuta cada archivo
				await sendInBatches(
					[file], // batch de 1 → manda archivo completo
					async (singleFileBatch) => {
						const currentFile = singleFileBatch[0];
						const [err] = await apiFn(currentFile);

						if (err) throw err;
					},
					0
				);
			}

			toast.success("Todo guardado correctamente");
		} catch (e) {
			toast.error("Error guardando datos");
		}
	};

	const handleReset = () => {
		clearAll();
		reset();
		setCurrentProcessingFile("");
		toast.info("Todo ha sido reiniciado");
	};

	const validFilesCount = Array.from(uploadedFiles.values()).filter(
		(f) => f.isValid
	).length;

	const canSave = validFilesCount > 0 && !isProcessing;
	return (
		<ExcelUploadView
			fileTypes={EXCEL_FILE_TYPES}
			uploadedFiles={uploadedFiles}
			progress={progress}
			isProcessing={isProcessing}
			completed={completed}
			currentBatch={currentBatch}
			totalBatches={totalBatches}
			errors={error as string}
			validFilesCount={validFilesCount}
			canSave={canSave}
			onFileSelect={handleFileSelect}
			onRemoveFile={removeFile}
			onSaveAll={handleSaveAll}
			onReset={handleReset}
		/>
	);
};
