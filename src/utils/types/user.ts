export interface responseMessage {
	message: string;
}

export interface userDevolver {
  id: string;
  rol: "user"
  nombre: string;
  userSecretJWT: string;
}

export const routeRoles: Record<string, string> = {
	"/user": "user",
};

export const roles = ["user"] as const;

export type Roles = (typeof roles)[number];

export const rolesUtilizar: { [key in Roles]: string } = {
	user: "user",
};

export type userDataLogin = {
	email: string;
	password: string;
	rol: "user";
};

export type updateUser = Partial<userDataLogin>;
