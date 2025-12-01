export interface ValidationError {
	field: string;
	message: string;
}

export interface ErrorResponse {
	message: string;
	error?: string;
	invalidRows?: Array<{
		fila: number;
		errores: ValidationError[];
	}>;
}

export interface UploadedFile {
	type: ExcelFileType;
	file: File;
	data: any[];
	isValid: boolean;
	errors: string[];
}

export interface UploadProgressProps {
	progress: number;
	isProcessing: boolean;
	completed: boolean;
	currentBatch: number;
	totalBatches: number;
	currentFile?: string;
}

export interface FileUploadZoneProps {
	fileType: ExcelFileType;
	uploadedFile?: UploadedFile;
	onFileSelect: (file: File) => void;
	onRemove: () => void;
	disabled?: boolean;
}

export interface ExcelFileType {
	id: string;
	name: string;
	description: string;
	requiredColumns: string[];
	exampleData: Record<string, string | number>[];
}

export const EXCEL_FILE_TYPES: ExcelFileType[] = [
	{
		id: "rutasAhora",
		name: "Clientes en ruta",
		description:
			"Determinar envió de mensajes a los clientes, cuyos pedidos están en rutas",
		requiredColumns: ["Solic.", "Teléfono 1", "Estado"],
		exampleData: [
			{ "Solic.": "11111100", "Teléfono 1": "3000000000", Estado: "EN RUTA" },
			{
				"Solic.": "11111100",
				"Teléfono 1": "3000000000",
				Estado: "SEGUNDO VIAJE",
			},
		],
	},
	{
		id: "ETA",
		name: "ETA: Tiempos promedio en ruta",
		description:
			"Crucial para indicarle al cliente lo más cercano a la realidad, en que rango de tiempo llegará su pedido",
		requiredColumns: ["CODIGO", "inicial", "final"],
		exampleData: [
			{ CODIGO: "11111100", inicial: "10:39", final: "15:30" },
			{ CODIGO: "11111100", inicial: "10:39", final: "15:30" },
		],
	},
	{
		id: "Pedidos",
		name: "Confirmar Pedidos",
		description:
			"Necesario para permitir la confirmación de pedidos por parte de los clientes y para el envió de este",
		requiredColumns: ["Cliente", "Nombre", "Cashless", "Telefono"],
		exampleData: [
			{
				Cliente: "11111100",
				Nombre: "Comercializados Cliente",
				Cashless: "SI",
				Telefono: "3000000000",
			},
			{
				Cliente: "11111100",
				Nombre: "Comercializados Cliente",
				Cashless: "NO",
				Telefono: "3000000000",
			},
		],
	},
	{
		id: "Consped",
		name: "Pedidos re-programados (rechazos)",
		description:
			"Envió de mensajes a clientes, cuyos pedidos fueron rechazados",
		requiredColumns: [
			"Cliente",
			"Material",
			"Material",
			"Motivo Rechazo",
			"Fecha preferente",
		],
		exampleData: [
			{
				Cliente: "11111100",
				"Material(id)": "00000",
				Material: "CORONA",
				"Motivo Rechazo": "Restricción logística externa",
				"Fecha preferente": "2024-01-15",
			},
			{
				Cliente: "11111100",
				"Fecha preferente": "2024-01-16",
				"Material(id)": "00000",
				"Motivo Rechazo": "",
				Material: "CORONA",
			},
		],
	},
];
