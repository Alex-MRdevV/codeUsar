import { THEME_STORAGE_KEY } from "@/utils/types/const";
import { atom } from "nanostores";

export type Theme = "light" | "dark";

export const themeStore = atom<Theme>(
	(localStorage.getItem(THEME_STORAGE_KEY) as Theme) ||
		(window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light")
);
