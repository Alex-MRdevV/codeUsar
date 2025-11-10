import { MOBILE_ACTIVE } from "@/utils/types/const";
import { atom, map } from "nanostores";

export type PhoneNumber = {
	id: string;
	number: string;
};

function loadActivePhoneId(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(MOBILE_ACTIVE);
}

function saveActivePhoneId(id: string | null) {
	if (typeof window === "undefined") return;
	if (id) {
		localStorage.setItem(MOBILE_ACTIVE, id);
	} else {
		localStorage.removeItem(MOBILE_ACTIVE);
	}
}

export const phoneItems = map<Record<string, PhoneNumber>>({});
export const activePhoneId = atom<string | null>(loadActivePhoneId());

export function addPhone({ id, number }: PhoneNumber) {
	const existingEntry = phoneItems.get()[id];
	if (!existingEntry) {
		phoneItems.setKey(id, { id, number });
		if (!activePhoneId.get()) {
			setActivePhone(id);
		}
	}
}

export function setActivePhone(id: string) {
	const phone = phoneItems.get()[id];
	if (phone) {
		activePhoneId.set(id);
		saveActivePhoneId(id); // Persistir en localStorage
	}
}

export function getActivePhone(): PhoneNumber | null {
	const id = activePhoneId.get();
	if (!id) return null;
	return phoneItems.get()[id] || null;
}

export function getActivePhoneId(): string | null {
	return activePhoneId.get();
}

export function removePhone(id: string) {
	const phones = { ...phoneItems.get() };
	delete phones[id];
	phoneItems.set(phones);

	if (activePhoneId.get() === id) {
		activePhoneId.set(null);
		saveActivePhoneId(null); // Limpiar localStorage
	}
}

export function clearPhones() {
	phoneItems.set({});
	activePhoneId.set(null);
	saveActivePhoneId(null); // Limpiar localStorage
}
