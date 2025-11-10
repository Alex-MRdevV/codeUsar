export interface responseMessage {
	message: string;
}

export interface userDevolver {
	id: string;
	rol: "user";
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

export type userData = {
	id: string;
	email: string;
	password: string;
	nombre: string;
	estado: ["activo", "retirado"];
	rol: "user";
	secretUserJWT: string;
};

export type userDataLogin = {
	email: string;
	password: string;
	rol: "user";
};

export type updateUser = Required<Pick<userData, "id">> &
	Partial<Omit<userData, "id" | "rol" | "secretUserJWT" | "estado">>;

export type updateUserAccessToken = Omit<
	userData,
	"password" | "nombre" | "estado" | "rol" | "secretUserJWT"
>;
