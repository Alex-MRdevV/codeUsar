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

export interface SuccessResponse {
	message: string;
	data?: {
		insertados: number;
		omitidos: number;
		filasInvalidas?: Array<{
			fila: number;
			errores: ValidationError[];
		}>;
	};
}

export type APIResponse = ErrorResponse | SuccessResponse;
