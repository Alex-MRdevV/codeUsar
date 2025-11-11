import { useSubmitHandler } from "@/hooks/common/use-submit";
import type { ReplyApiResponse, SendMessageRequest } from "@/utils/types/providers/meta";
import { useState } from "react";

export const ConfigurarSend = () => {
	const [resultados, setResultados] = useState<ReplyApiResponse | null>(null);

	const { createHandler, isSubmitting } = useSubmitHandler<SendMessageRequest, ReplyApiResponse>({
		loadingMessage: "Enviando mensaje...",
		successMessage: "Mensaje enviado",
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
