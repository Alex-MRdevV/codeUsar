import { res } from "@/utils/responseAstro";
import type { APIRoute } from "astro";

export const POST: APIRoute = ({ cookies }) => {
	if (!cookies.get("tokenAcceso")) {
		return res("", { status: 401 });
	}

	cookies.delete("tokenAcceso");
	return res({ message: "sesión cerrada correctamente" }, { status: 200 });
};
