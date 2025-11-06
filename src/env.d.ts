/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
import { JWTPayload } from "jose";

declare global {
	namespace App {
		interface Locals extends Record<string, any> {
			user: JWTPayload;
		}
	}
}
