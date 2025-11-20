import { UploadFileResponse } from "@/utils/services/uploadFile";
import { EXCEL_FILE_TYPES, type ExcelFileType, type UploadedFile } from "@/utils/types/file";
import { useCallback, useState } from "react";

export const useExcelUpload = () => {
	const [uploadedFiles, setUploadedFiles] = useState<Map<string, UploadedFile>>(new Map());
	const [isUploading, setIsUploading] = useState(false);

	const validateFileWithBackend = useCallback(async (file: File) => {
		const [err, res] = await UploadFileResponse([file]);

		if (err) throw err;
		const payload = res?.data;
		const filasInvalidas = payload?.filasInvalidas ?? [];

		// Convertimos las filasInvalidas en strings porque UploadedFile.errors es string[]
		const errorMessages = filasInvalidas.map((f) => {
			const detalles = f.errores
				.map((e) => `${e.field}: ${e.message}`)
				.join(", ");
			return `Fila ${f.fila}: ${detalles}`;
		});

		// UploadedFile.data exige any[] → envolvemos el objeto en un array
		const dataArray = payload ? [payload] : [];
		const uploaded: UploadedFile = {
			type: null as any, // se reemplaza más adelante
			file,
			data: dataArray,
			isValid: filasInvalidas.length === 0,
			errors: errorMessages,
		};
		return uploaded;
	}, []);

	const uploadFile = useCallback(
		async (file: File, fileType: ExcelFileType) => {
			setIsUploading(true);
			try {
				const uploadedFile = await validateFileWithBackend(file);
				uploadedFile.type = fileType; // inyectamos el tipo aquí
				setUploadedFiles((prev) => {
					const newMap = new Map(prev);
					newMap.set(fileType.id, uploadedFile);
					return newMap;
				});
				return uploadedFile;
			} catch (error) {
				throw error;
			} finally {
				setIsUploading(false);
			}
		},
		[validateFileWithBackend]
	);

	const removeFile = useCallback((fileTypeId: string) => {
		setUploadedFiles((prev) => {
			const newMap = new Map(prev);
			newMap.delete(fileTypeId);
			return newMap;
		});
	}, []);

	const clearAll = useCallback(() => {
		setUploadedFiles(new Map());
	}, []);

	const getFileData = useCallback(
		(fileTypeId: string) => uploadedFiles.get(fileTypeId),
		[uploadedFiles]
	);

	// Ahora getAllData devuelve los "data" reales enviados por el backend,
	const getAllData = useCallback(() => {
		const allData: Record<string, any> = {};
		uploadedFiles.forEach((file, key) => {
			if (file.isValid) {
				allData[key] = file.data;
			}
		});
		return allData;
	}, [uploadedFiles]);

	const getAllFiles = useCallback(() => {
		const allFiles: Record<string, File> = {};
		uploadedFiles.forEach((uploadedFile, key) => {
			if (uploadedFile.isValid) {
				allFiles[key] = uploadedFile.file;
			}
		});
		return allFiles;
	}, [uploadedFiles]);

	return {
		uploadedFiles,
		uploadFile,
		removeFile,
		clearAll,
		getFileData,
		getAllData,
		getAllFiles,
		fileTypes: EXCEL_FILE_TYPES,
		isUploading,
	};
};
