import { tourActiveStore } from '@/stores/tourActive';
import { TOUR_STORAGE_KEY } from '@/utils/types/const';
import { useEffect } from 'react';

export const useTourInit = (trigger: boolean) => {
	useEffect(() => {
		if (!trigger) return;// we don't do anything if there was no modal yet
		const alreadyRan = localStorage.getItem(TOUR_STORAGE_KEY);
		if (!alreadyRan) {
			localStorage.setItem(TOUR_STORAGE_KEY, 'true');
			tourActiveStore.set('true');
		}
	}, [trigger]);

	return null;
}
