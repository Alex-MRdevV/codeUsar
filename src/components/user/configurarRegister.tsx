import { useSubmitHandler } from "@/hooks/common/use-submit";
import type { FormValuesCreate } from "@/lib/schemas/user/register";
import type { userDevolver } from "@/utils/types/user";
import { useState } from "react";

export const ConfigurarRegister = () => {
	const [resultados, setResultados] = useState<userDevolver | null>(null);

	const { createHandler, isSubmitting } = useSubmitHandler<FormValuesCreate, userDevolver>({
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
