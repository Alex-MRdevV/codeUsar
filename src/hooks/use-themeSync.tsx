
import type { Theme } from '@/stores/themes';
import { THEME_STORAGE_KEY } from "@/utils/types/const";
import { useEffect, useLayoutEffect } from 'react';

export const useThemeSync = (theme: Theme) => {
	useLayoutEffect(() => {
		document.documentElement.classList.toggle('dark', theme === 'dark');
	}, [theme]);

	useEffect(() => {
		localStorage.setItem(THEME_STORAGE_KEY, theme);
	}, [theme]);

	return null;
}
