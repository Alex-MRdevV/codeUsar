import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";

const isProtectedRoute = createRouteMatcher(["/users(.*)"]);

export const onRequest = clerkMiddleware((auth, context) => {
	const { isAuthenticated } = auth();

	if (isProtectedRoute(context.request) && !isAuthenticated) {
		return context.redirect("/noAccess");
	}
});
