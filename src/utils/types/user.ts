import type {
	FieldErrors,
	SubmitErrorHandler,
	SubmitHandler,
	UseFormRegister,
} from "react-hook-form";

export type UserData = {
	id: string;
	name: string;
	email: string;
	createdAt: Date;
};

export type UserDevolver = Pick<UserData, "id" | "name">;

export const routeRoles: Record<string, string> = {
	"/user": "user",
};

export type UserContext = Pick<UserData, "id" | "email" | "name"> & {
	isLoggedIn: boolean;
};

export interface UseRedirectEventOptions<T> {
	eventName: string;
	enabled?: boolean;
	delay?: number;
	onBeforeDispatch?: (data: T) => void;
	onAfterDispatch?: (data: T) => void;
}

export interface LoginContentProps {
	register: UseFormRegister<{
		email: string;
		password: string;
	}>;
	handleSubmit: (
		onValid: SubmitHandler<{
			email: string;
			password: string;
		}>,
		onInvalid?:
			| SubmitErrorHandler<{
					email: string;
					password: string;
			  }>
			| undefined
	) => (e?: React.BaseSyntheticEvent) => Promise<void>;
	onSubmit: SubmitHandler<{
		email: string;
		password: string;
	}>;
	errors: FieldErrors<{
		email: string;
		password: string;
	}>;
	message: string | Error | null;
}
