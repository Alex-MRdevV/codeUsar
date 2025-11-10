import { MOBILE_ACTIVE } from "@/utils/types/const";
import { atom } from "nanostores";

export interface PhoneNumber {
	id: string;
	number: string;
}

const getStoredPhone = atom<PhoneNumber | null>(
	(localStorage.getItem(MOBILE_ACTIVE) as guardar)
) {
  try {
    const stored = localStorage.getItem();
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// Store para la lista de teléfonos
export const phonesStore = atom<PhoneNumber[]>([]);

// Acciones
export const setPhones = (phones: PhoneNumber[]) => {
	phonesStore.set(phones);
};

export const selectPhone = (id: string) => {
	selectedPhoneId.set(id);
};

export const getSelectedPhone = (): PhoneNumber | null => {
	const phones = phonesStore.get();
	const selectedId = selectedPhoneId.get();

	if (!selectedId) return null;

	return phones.find((p) => p.id === selectedId) || null;
};
