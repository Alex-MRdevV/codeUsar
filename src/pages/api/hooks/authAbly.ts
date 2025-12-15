import { res } from "@/utils/responseAstro";
import Ably from "ably";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
	try {
		const ably = new Ably.Rest({
			key: import.meta.env.ACCESS_TOKEN_ABLY,
		});

		const tokenRequest = await ably.auth.createTokenRequest({
			clientId: "SendFlow",
		});

		return res(tokenRequest, {
			status: 200,
		});
	} catch (error) {
		return res(
			{
				messages: "Algo fallo a autenticar con Ably",
			},
			{
				status: 500,
			}
		);
	}
};
