import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";

const isProtectedRoute = createRouteMatcher(["/user(.*)"]);

export const onRequest = clerkMiddleware((auth, context) => {
	const { isAuthenticated, redirectToSignIn, userId } = auth();

	if (isProtectedRoute(context.request) && !isAuthenticated) {
		return redirectToSignIn();
	}
});
