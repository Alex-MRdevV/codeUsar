import { insertMessageFromWebhook } from "@/lib/drizzle/historyNumbers";
import { res } from "@/utils/responseAstro";
import Ably from "ably";
import type { APIRoute } from "astro";

export const runtime = "nodejs";
export const prerender = false;

const verifyToken = import.meta.env.META_VERIFY_TOKEN;
const ablyRest = new Ably.Rest({ key: import.meta.env.ACCESS_TOKEN_ABLY });

export const GET: APIRoute = async ({ url }) => {
	const mode = url.searchParams.get("hub.mode");
	const challenge = url.searchParams.get("hub.challenge");
	const token = url.searchParams.get("hub.verify_token");

	if (mode === "subscribe" && token === verifyToken) {
		return res(challenge, { status: 200 });
	}

	return res(null, { status: 403 });
};

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json();
		await processWebhookWithAbly(body);
		return res(null, { status: 200 });
	} catch (error) {
		console.log(error);
		return res(null, { status: 200 });
	}
};

async function processWebhookWithAbly(body: any) {
	try {
		const entry = body.entry?.[0];
		const change = entry?.changes?.[0];
		const value = change?.value;

		// Logs detallados para ver la estructura completa
		console.log("=== WEBHOOK PAYLOAD ===");
		console.log("Full body:", JSON.stringify(body, null, 2));
		console.log("Entry:", JSON.stringify(entry, null, 2));
		console.log("Change:", JSON.stringify(change, null, 2));
		console.log("Value:", JSON.stringify(value, null, 2));

		// Si hay mensajes, mostrar su contenido
		if (value?.messages?.length > 0) {
			console.log("Messages:", JSON.stringify(value.messages, null, 2));
		}

		await insertMessageFromWebhook(body);

		const channel = ablyRest.channels.get("notifications");

		// Manejar nuevos mensajes entrantes
		if (value?.messages?.length > 0) {
			const message = value.messages[0];
			const notification = {
				type: "message",
				id: message.id,
				whatsappMessageId: message.id,
				phone: message.from,
				contactName: value.contacts?.[0]?.profile?.name || "Unknown",
				messageType: message.type,
				content: message.text?.body || message.caption || "",
				timestamp: new Date(parseInt(message.timestamp) * 1000).toISOString(),
				isRead: false,
				direction: "inbound",
			};

			// Publicar nuevo mensaje
			await channel.publish("new-message", notification);
		}

		// Manejar actualizaciones de estado (sent, delivered, read, failed)
		if (value?.statuses?.length > 0) {
			const status = value.statuses[0];

			const statusNotification = {
				type: "status",
				whatsappMessageId: status.id,
				phone: status.recipient_id,
				status: status.status,
				timestamp: new Date(parseInt(status.timestamp) * 1000).toISOString(),
			};

			// Publicar actualización de estado
			await channel.publish("message-status-update", statusNotification);
		}
	} catch (error) {
		throw error;
	}
}
