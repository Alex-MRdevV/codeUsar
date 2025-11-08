import { useSubmitHandler } from "@/hooks/common/use-submit";
import type { ApiResponse, SendMessageRequest } from "@/utils/types/providers/meta";
import { useState } from "react";

export const ConfigurarSend = () => {
	const [resultados, setResultados] = useState<ApiResponse | null>(null);

	const { createHandler, isSubmitting } = useSubmitHandler<SendMessageRequest, ApiResponse>({
		loadingMessage: "Enviando mensajes...",
		successMessage: "Proceso completado",
		onSuccess: (data) => setResultados(data)
	});

	const resetResultados = () => setResultados(null);

	return {
		resultados,
		createHandler,
		resetResultados,
		isSubmitting,
	}
}
