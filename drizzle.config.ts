import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

export default defineConfig({
	schema: "./src/db/schemaTransitional/",
	out: "./migrations",
	dialect: "turso",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
		authToken: process.env.ACCESS_TOKEN_TURSO!,
	},
});
