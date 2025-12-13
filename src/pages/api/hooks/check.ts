import { insertMessageFromWebhook } from "@/lib/drizzle/historyNumbers";
import type { APIRoute } from "astro";
import Ably from "ably";

const verifyToken = import.meta.env.META_VERIFY_TOKEN;
const ablyRest = new Ably.Rest({ key: import.meta.env.ACCESS_TOKEN_ABLY });

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
		processWebhookWithAbly(body);

		return new Response(null, { status: 200 });
	} catch (error) {
		// Aún así responder 200 para evitar reintentos de Meta
		return new Response(null, { status: 200 });
	}
};

async function processWebhookWithAbly(body: any) {
	try {
		const entry = body.entry?.[0];
		const change = entry?.changes?.[0];
		const value = change?.value;

		// 1. Guardar en base de datos (tu función existente)
		await insertMessageFromWebhook(body);

		// 2. Si es un mensaje entrante, publicarlo en Ably
		if (value?.messages && value.messages.length > 0) {
			const message = value.messages[0];

			// Construir la notificación que se enviará a Ably
			const notification = {
				id: message.id,
				phone: message.from,
				contactName: value.contacts?.[0]?.profile?.name || "Unknown",
				messageType: message.type,
				content: message.text?.body || message.caption || "",
				timestamp: new Date(parseInt(message.timestamp) * 1000).toISOString(),
				isRead: false,
			};

			const channel = ablyRest.channels.get("notifications");
			await channel.publish("new-notification", notification);
		}
	} catch (error) {
		throw error;
	}
}
