import { getPhones } from "@/lib/providersMensajes/callApi/useAPiPhones";
import type { PhoneData } from "@/utils/types/message";
import { useEffect, useState } from "react";

export function usePhones() {
	const [phones, setPhones] = useState<PhoneData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPhones = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await getPhones();
				setPhones(data);
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "Error desconocido al cargar teléfonos";
				setError(errorMessage);
				console.error("Error al cargar teléfonos:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchPhones();
	}, []);

	return { phones, loading, error };
}
