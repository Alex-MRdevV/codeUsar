import { TOUR_STORAGE_KEY } from "@/utils/types/const";
import { atom } from "nanostores";

export type statusTour = "true" | "false";

export const tourActiveStore = atom<statusTour>(
	(localStorage.getItem(TOUR_STORAGE_KEY) as statusTour) || "true"
);
