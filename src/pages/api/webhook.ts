import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url, locals }) => {
	const { env } = locals.runtime;
	const VERIFY_TOKEN = env.VERIFY_TOKEN;

	const mode = url.searchParams.get("hub.mode");
	const challenge = url.searchParams.get("hub.challenge");
	const token = url.searchParams.get("hub.verify_token");

	if (mode === "subscribe" && token === VERIFY_TOKEN) {
		return new Response(challenge, { status: 200 });
	}
	return new Response("Forbidden", { status: 403 });
};

// ✅ Recepción de eventos de WhatsApp (mensajes, estados, errores, etc.)
export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json();

		// 1️⃣ Validar que sea de WhatsApp
		if (body.object !== "whatsapp_business_account") {
			return new Response("Ignored", { status: 200 });
		}

		// 2️⃣ Procesar cada entrada (entry)
		for (const entry of body.entry ?? []) {
			for (const change of entry.changes ?? []) {
				const value = change.value || {};
				const field = change.field;

				if (field === "messages" && value.messages) {
					for (const msg of value.messages) {
						const from = msg.from;
						const text = msg.text?.body || "";
						const name = value.contacts?.[0]?.profile?.name || "Desconocido";

						console.log(`💬 Mensaje recibido de ${name} (${from}): ${text}`);

						// 👉 Aquí podrías:
						// - Guardar el mensaje en tu DB
						// - Responder al usuario con fetch() a la API de WhatsApp
					}
				}

				if (field === "message_status" && value.statuses) {
					for (const status of value.statuses) {
						console.log(
							`📦 Estado de mensaje: ${status.status} (${status.id})`
						);
					}
				}

				if (field === "errors") {
					console.error("⚠️ Error reportado:", value);
				}
			}
		}

		return new Response("EVENT_RECEIVED", { status: 200 });
	} catch (error) {
		return new Response("Error", { status: 500 });
	}
};
