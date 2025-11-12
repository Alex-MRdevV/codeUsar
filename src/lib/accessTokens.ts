import { type userDevolver } from "@/utils/types/user";
import { SignJWT } from "jose";

export async function accessToken(payload: userDevolver): Promise<string> {
	const secret = new TextEncoder().encode(import.meta.env.SECRET_KEY_JWT);

	try {
		const token = await new SignJWT({ payload })
			.setProtectedHeader({ alg: "HS256", typ: "JWT" }) // 🔥 obligatorio
			.setIssuedAt()
			.setExpirationTime("7d")
			.sign(secret);

		return token;
	} catch (error) {
		throw new Error(`Error generando token: ${error}`);
	}
}
