import { routeRoles } from "@/utils/types/user";
import { defineMiddleware } from "astro/middleware";
import { jwtVerify } from "jose";

export const onRequest = defineMiddleware(async (context, next) => {
	const token = context.cookies.get("tokenAcceso");

	// Verificar si la ruta actual es una ruta protegida
	const requiredRole = Object.keys(routeRoles).find((route) =>
		context.url.pathname.startsWith(route)
	);

	if (requiredRole) {
		if (!token) return context.redirect("/login");
		try {
			const { value } = token;
			const { payload } = await jwtVerify(
				value,
				new TextEncoder().encode(import.meta.env.SECRET_KEY_JWT)
			);

			// Almacenar la información del usuario en el contexto para su uso
			context.locals.user = payload;

			const roleRequired = routeRoles[requiredRole];
			if (payload.rol !== roleRequired) return context.redirect("/noAccess");

			return next();
		} catch (error) {
			return context.redirect("/login");
		}
	}

	return next();
});
