import { useThemeSync } from "@/hooks/use-themeSync";
import { themeStore } from "@/stores/themes";
import { tourActiveStore } from '@/stores/tourActive';
import { TOUR_STORAGE_KEY } from "@/utils/types/const";
import { useStore } from '@nanostores/react';
import { useEffect } from 'react';
import { Toaster } from "sonner";

interface Props {
	children: React.ReactNode;
}

export const TourWrapper = ({ children }: Props) => {
	const theme = useStore(themeStore);
	useThemeSync(theme);

	useEffect(() => {
		// Verificar si es la primera visita
		const isFirstVisit = !localStorage.getItem(TOUR_STORAGE_KEY);
		if (isFirstVisit) {
			localStorage.setItem(TOUR_STORAGE_KEY, 'true');
			tourActiveStore.set('true');
		}
	}, []);

	return <>
		<Toaster richColors theme={theme === "dark" ? "dark" : "light"} />
		{children}
	</>
};
