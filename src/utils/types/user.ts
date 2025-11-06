export interface responseMessage {
	message: string;
}

export type LoginFormData = {
	email: string;
	password: string;
	rol: "user" | "admin";
};
