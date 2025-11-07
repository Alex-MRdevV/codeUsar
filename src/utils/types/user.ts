export interface responseMessage {
	message: string;
}

export const routeRoles: Record<string, string> = {
	"/admin": "admin",
	"/user": "usuario",
};

export const roles = ["admin", "user"] as const;

export type Roles = (typeof roles)[number];

export const rolesUtilizar: { [key in Roles]: string } = {
	admin: "admin",
	user: "user",
};

export type userDataLogin = {
	email: string;
	password: string;
	rol: "user" | "admin";
};

export type updateUser = Partial<userDataLogin>;
