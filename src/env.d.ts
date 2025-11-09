/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
import { JWTPayload } from "jose";

declare global {
	namespace App {
		interface Locals extends Record<string, any> {
			user: JWTPayload;
		}
		interface Env {
			DB: D1Database;
		}
	}
}

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;
