// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import cloudflare from "@astrojs/cloudflare";

import clerk from "@clerk/astro";

import { esMX } from "@clerk/localizations";

// https://astro.build/config
export default defineConfig({
	output: "server",
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [
		react(),
		clerk({
			localization: esMX,
		}),
	],
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
		},
	}),
});
