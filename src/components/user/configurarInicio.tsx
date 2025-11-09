import { useSubmitHandler } from "@/hooks/common/use-submit";
import type { responseMessage, userDataLogin } from "@/utils/types/user";
import { useState } from "react";

export const ConfigurarInicio = () => {
	const [resultados, setResultados] = useState<responseMessage | null>(null);

	const { createHandler, isSubmitting } = useSubmitHandler<userDataLogin, responseMessage>({
		loadingMessage: "Iniciando sesión...",
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
