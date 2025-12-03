// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import clerk from "@clerk/astro";

import { esMX } from "@clerk/localizations";

import { dark } from "@clerk/themes";

import vercel from "@astrojs/vercel";

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
            appearance: {
                baseTheme: dark,
            },
        }),
    ],
    adapter: vercel(),
});
