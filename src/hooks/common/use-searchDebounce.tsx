import type { SearchableItem } from "@/utils/types/common";
import { useCallback, useEffect, useRef, useState } from "react";

// Función para buscar un elemento en una lista con validaciones adicionales
export const searchItem = <T extends SearchableItem>(
	searchTerm: string,
	data: T[] = [], // Asegura que data siempre sea un array
	property: keyof T
): T | undefined => {
	if (!searchTerm || !Array.isArray(data) || data.length === 0) return undefined;

	const searchTermLower = searchTerm.toLowerCase().trim();

	return data.find((item) => {
		const propertyValue = item[property];
		if (typeof propertyValue !== "string") return false;
		return propertyValue.toLowerCase().includes(searchTermLower);
	});
};

export const useSearchWithDebounce = <T extends SearchableItem>(
	searchTerm: string,
	data: T[] = [],
	property: keyof T,
	delay: number = 300
): T[] => {
	const [results, setResults] = useState<T[]>([]);

	useEffect(() => {
		if (!searchTerm || !Array.isArray(data) || data.length === 0) {
			setResults([]);
			return;
		}

		const timeoutId = setTimeout(() => {
			const searchTermLower = searchTerm.toLowerCase().trim();

			const filteredResults = data.filter((item) => {
				const propertyValue = item[property];
				if (typeof propertyValue !== "string") return false;
				return propertyValue.toLowerCase().includes(searchTermLower);
			});

			setResults(filteredResults);
		}, delay);

		return () => clearTimeout(timeoutId);
	}, [searchTerm, data, property, delay]);

	return results;
};

// Hook para crear una función debounced reusable con validaciones adicionales
export const useDebouncedSearch = <T extends SearchableItem>(delay: number = 300) => {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	return useCallback(
		(
			searchTerm: string,
			data: T[] = [],
			property: keyof T,
			callback: (result: T | undefined) => void
		) => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);

			timeoutRef.current = setTimeout(() => {
				const result = searchItem<T>(searchTerm, data, property);
				callback(result);
			}, delay);
		},
		[delay]
	);
};
