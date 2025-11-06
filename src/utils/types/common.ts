import { type FieldErrors, type UseFormRegister } from "react-hook-form";

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
