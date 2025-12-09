export const logoutResponse = async (): Promise<
	[Error | null, string | null]
> => {
	try {
		const response = await fetch(`/api/user/logout`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			// Solo intentar parsear JSON si hay contenido
			if (response.status !== 204) {
				try {
					const errorData = await response.json();
					return [new Error(errorData.message || "Error desconocido"), null];
				} catch {
					// Si no se puede parsear JSON, usar el texto del error
					return [new Error(`Error ${response.status}`), null];
				}
			}
			return [new Error(`Error ${response.status}`), null];
		}

		// Para respuestas 204, no hay contenido que parsear
		if (response.status === 204) {
			return [null, "Logout exitoso"];
		}

		// Para otros códigos de éxito (por si acaso)
		const data = await response.json();
		return [null, data.message || "Logout exitoso"];
	} catch (error) {
		return [error as Error, null];
	}
};
