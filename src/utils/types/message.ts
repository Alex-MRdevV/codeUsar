export const nameTemplates = [
	"confirmacion_entrega_pedidos",
	"confirmacion_reasignacion_entregas",
	"delivery_confirmation_4",
];

export const clasesContactos = ["Todos los contactos", "Clientes"];

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
