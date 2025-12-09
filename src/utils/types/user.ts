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
	status: "activo" | "retirado";
	role: "user" | "admin";
	createdAt: Date;
};

export type UserDevolver = Pick<UserData, "id" | "name" | "role">;

export const routeRoles: Record<string, string> = {
	"/user": "user",
	"/admin": "admin",
};

export const roles = ["user", "admin"] as const;
export type Roles = (typeof roles)[number];

export const rolesUtilizar: { [key in Roles]: string } = {
	user: "user",
	admin: "admin",
};

export type UserContext = Pick<UserData, "id" | "email" | "name" | "role"> & {
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
		role: "user" | "admin";
	}>;
	handleSubmit: (
		onValid: SubmitHandler<{
			email: string;
			password: string;
			role: "user" | "admin";
		}>,
		onInvalid?:
			| SubmitErrorHandler<{
					email: string;
					password: string;
					role: "user" | "admin";
			  }>
			| undefined
	) => (e?: React.BaseSyntheticEvent) => Promise<void>;
	onSubmit: SubmitHandler<{
		email: string;
		password: string;
		role: "user" | "admin";
	}>;
	errors: FieldErrors<{
		email: string;
		password: string;
		role: "user" | "admin";
	}>;
	message: string | Error | null;
}
