export interface ExcelFileType {
	id: string;
	name: string;
	description: string;
	requiredColumns: string[];
	exampleData: Record<string, string | number>[];
}

export interface ExcelRow {
	Nombre: string;
	Celular: string;
	[key: string]: unknown;
}

export interface ExcelRowRutas {
	Nombre: string;
	Celular: string;
	"Hora inicial": string;
	"Hora Final": string;
	[key: string]: unknown;
}

export interface EmptyStateProps {
	fileType: ExcelFileType;
	isDragActive: boolean;
}

export interface SuccessStateProps {
	uploadedFile: UploadedFile;
	onRemove: () => void;
}

export interface UploadedFile {
	type: ExcelFileType;
	file: File;
	data: any[];
	isValid: boolean;
	errors: string[];
}

export interface ExcelUploadViewProps {
	fileTypes: any[];
	uploadedFiles: Map<string, any>;
	progress: number;
	isProcessing: boolean;
	completed: boolean;
	currentBatch: number;
	totalBatches: number;
	validFilesCount: number;
	canSave: boolean;
	onFileSelect: (file: File, fileTypeId: string) => void;
	onRemoveFile: (fileTypeId: string) => void;
	onSaveAll: () => void;
	onReset: () => void;
	errors: string;
}
