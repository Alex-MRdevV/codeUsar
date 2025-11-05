import { THEME_STORAGE_KEY } from "@/utils/types/const";
import { atom } from "nanostores";

export type tema = "light" | "dark";

export const themeStore = atom<tema>(
	(localStorage.getItem(THEME_STORAGE_KEY) as tema) ||
		(window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light")
);
