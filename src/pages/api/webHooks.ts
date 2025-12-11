import type { APIRoute } from "astro";

const verifyToken = import.meta.env.META_VERIFY_TOKEN;

export const get: APIRoute = async ({ url }) => {
	const mode = url.searchParams.get("hub.mode");
	const challenge = url.searchParams.get("hub.challenge");
	const token = url.searchParams.get("hub.verify_token");

	if (mode === "subscribe" && token === verifyToken) {
		console.log("WEBHOOK VERIFIED");
		return new Response(challenge, { status: 200 });
	}

	return new Response(null, { status: 403 });
};

// ------------------------------
// POST → Recepción de mensajes
// ------------------------------
export const post: APIRoute = async ({ request }) => {
	const body = await request.json();

	const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
	console.log(`\n\nWebhook received ${timestamp}\n`);
	console.log(JSON.stringify(body, null, 2));

	// Meta exige responder 200 OK inmediatamente
	return new Response(null, { status: 200 });
};
