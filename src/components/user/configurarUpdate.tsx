import { useSubmitHandler } from "@/hooks/common/use-submit";
import type { FormValuesUpdate } from "@/lib/schemas/user/register";
import type { responseMessage } from "@/utils/types/user";
import { useState } from "react";

export const ConfigurarUpdate = () => {
	const [resultados, setResultados] = useState<responseMessage | null>(null);

	const { createHandler, isSubmitting } = useSubmitHandler<FormValuesUpdate, responseMessage>({
		loadingMessage: "Creando cuenta...",
		successMessage: "Cuenta creada",
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
