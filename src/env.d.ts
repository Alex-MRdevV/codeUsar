/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare global {
	namespace App {}
}

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;
