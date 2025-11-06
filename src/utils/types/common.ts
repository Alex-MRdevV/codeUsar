import { type FieldErrors, type UseFormRegister } from "react-hook-form";

export interface SearchableItem {
  id: string;
  [key: string]: any; // Permite que el objeto tenga cualquier otra propiedad
}

interface BaseInputProps {
	register: UseFormRegister<any>;
	errors: FieldErrors<any>;
	labelNombre: string;
	htmlForNombre: string;
	valueRegister: string;
	placeholder?: string;
}

export interface InputEmailProps extends BaseInputProps {
	typeInput: string;
}

export interface ViewPasswordProps extends BaseInputProps {
	resetPassword?: boolean;
}
