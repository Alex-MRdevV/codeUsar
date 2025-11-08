export interface SubmitHandlerOptions<TData, TResponse> {
	loadingMessage: string;
	successMessage: string;
	onSubmitFn: (data: TData) => Promise<[Error | null, TResponse | null]>;
	onError?: (error: Error) => void;
	onSuccess?: (response: TResponse) => void;
}
