import { insertMessageFromWebhook } from "@/lib/drizzle/historyNumbers";
import type { APIRoute } from "astro";

const verifyToken = import.meta.env.META_VERIFY_TOKEN;

export const GET: APIRoute = async ({ url }) => {
	const mode = url.searchParams.get("hub.mode");
	const challenge = url.searchParams.get("hub.challenge");
	const token = url.searchParams.get("hub.verify_token");

	if (mode === "subscribe" && token === verifyToken) {
		return new Response(challenge, { status: 200 });
	}

	return new Response(null, { status: 403 });
};

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json();
		const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
		console.log(`\n\nWebhook received ${timestamp}\n`);
		console.log(JSON.stringify(body, null, 2));

		// Procesar el webhook de forma asíncrona sin bloquear la respuesta
		insertMessageFromWebhook(body).catch((error) => {
			console.error("Error processing webhook:", error);
			// Aquí podrías implementar un sistema de reintentos o logging a un servicio externo
		});

		return new Response(null, { status: 200 });
	} catch (error) {
		console.error("Error parsing webhook body:", error);
		// Aún así responder 200 para evitar reintentos de Meta
		return new Response(null, { status: 200 });
	}
};
