export interface ExcelFileType {
	id: string;
	name: string;
	description: string;
	requiredColumns: string[];
	exampleData: Record<string, string | number>[];
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

export const EXCEL_FILE_TYPES: ExcelFileType[] = [
	{
		id: "consolidado",
		name: "Consolidado",
		description:
			"Documento que reúne los datos necesarios del rutero(idCliente, nombre, numero de teléfono, estado) y ETA(idCliente, hora inicial, hora final de la ruta) para establecer las horas en las que se suelen entregar los pedidos a dichos clientes",
		requiredColumns: [
			"idCliente",
			"nombreEstablecimiento",
			"phoneNumber",
			"Estado",
			"clienteId",
			"horaInicial",
			"horaFinal",
		],
		exampleData: [
			{
				idCliente: "11111100",
				nombreEstablecimiento: "Establecimiento x",
				phoneNumber: "1111111111",
				Estado: "EN RUTA",
				clienteId: "11111100",
				horaInicial: "8:33:24",
				horaFinal: "12:33:24",
			},
			{
				idCliente: "11111100",
				nombreEstablecimiento: "Establecimiento x",
				phoneNumber: "1111111111",
				Estado: "EN RUTA",
				clienteId: "11111100",
				horaInicial: "8:33:24",
				horaFinal: "12:33:24",
			},
		],
	},
	{
		id: "BavariaNow",
		name: "BavariaNow template",
		description:
			"Necesario para dar a conocer a la app (bavariaNow) y para el envió de mensajes a clientes cuyos pedidos fueron rechazados",
		requiredColumns: [
			"Cliente",
			"No ped Cliente",
			"Cod Rechazo",
			"Fecha pref",
			"Cajas",
			"Nombre establecimiento",
			"Cashless",
		],
		exampleData: [
			{
				Cliente: "11111100",
				"No ped Cliente": "12222222",
				"Cod Rechazo": "99",
				"Fecha pref": "10/10/2025",
				Cajas: 5,
				"Nombre establecimiento": "Comercializados Cliente",
				Cashless: "SI",
			},
			{
				Cliente: "11111100",
				"No ped Cliente": "12222222",
				"Cod Rechazo": "99",
				"Fecha pref": "10/10/2025",
				Cajas: 5,
				"Nombre establecimiento": "Comercializados Cliente",
				Cashless: "SI",
			},
		],
	},
];
