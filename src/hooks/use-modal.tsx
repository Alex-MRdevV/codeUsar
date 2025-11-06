import { useCallback, useRef, useState } from "react";

export const useModal = () => {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [isOpen, setIsOpen] = useState(false);

	const openModal = useCallback(() => {
		if (dialogRef.current && !dialogRef.current.open) {
			dialogRef.current.showModal();
			setIsOpen(true);
		}
	}, []);

	const closeModal = useCallback(() => {
		if (dialogRef.current?.open) {
			dialogRef.current.close();
			setIsOpen(false);
		}
	}, []);

	return { dialogRef, isOpen, openModal, closeModal };
};
