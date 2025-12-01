import { useCallback, useState } from "react";

export type ExcelUploadOptions<T> = {
	validate: (file: File) => Promise<T>;  // función genérica que valida y retorna payload
	parseErrors?: (payload: T) => string[]; // opcional: transformar errores si existen
	parseData?: (payload: T) => any;        // opcional: transformar data real para la app
};

export type UploadedExcelFile = {
	file: File;
	rawPayload: any;        // todo lo que viene del backend
	data: any;              // data parseada para la app
	errors: string[];
	isValid: boolean;
};

export function useExcelUpload<T = any>(options: ExcelUploadOptions<T>) {
	const { validate, parseErrors, parseData } = options;

	const [uploadedFiles, setUploadedFiles] = useState<
		Map<string, UploadedExcelFile>
	>(new Map());

	const [isUploading, setIsUploading] = useState(false);

	const uploadFile = useCallback(
		async (fileTypeId: string, file: File) => {
			setIsUploading(true);
			try {
				const payload = await validate(file);

				const errors = parseErrors ? parseErrors(payload) : [];
				const data = parseData ? parseData(payload) : payload;

				const uploaded: UploadedExcelFile = {
					file,
					rawPayload: payload,
					data,
					errors,
					isValid: errors.length === 0,
				};

				setUploadedFiles((prev) => {
					const newMap = new Map(prev);
					newMap.set(fileTypeId, uploaded);
					return newMap;
				});
			} catch (err) {
				console.error("Error subiendo archivo:", err);
			} finally {
				setIsUploading(false);
			}
		},
		[validate, parseErrors, parseData]
	);

	const removeFile = useCallback((fileTypeId: string) => {
		setUploadedFiles((prev) => {
			const next = new Map(prev);
			next.delete(fileTypeId);
			return next;
		});
	}, []);

	const clearAll = useCallback(() => {
		setUploadedFiles(new Map());
	}, []);

	const getFileData = useCallback(
		(fileTypeId: string) => uploadedFiles.get(fileTypeId),
		[uploadedFiles]
	);

	const getAllData = useCallback(() => {
		const result: Record<string, any> = {};
		uploadedFiles.forEach((item, key) => {
			if (item.isValid) result[key] = item.data;
		});
		return result;
	}, [uploadedFiles]);

	const getAllFiles = useCallback(() => {
		const result: Record<string, File> = {};
		uploadedFiles.forEach((item, key) => {
			if (item.isValid) result[key] = item.file;
		});
		return result;
	}, [uploadedFiles]);

	return {
		uploadedFiles,
		uploadFile,
		removeFile,
		clearAll,
		getFileData,
		getAllData,
		getAllFiles,
		isUploading,
	};
}
