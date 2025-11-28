import type { Config } from "drizzle-kit";

export default {
	schema: "./src/db/schema",
	out: "./src/db/migrations",
	dialect: "mysql",
	dbCredentials: {
		user: process.env.DB_USER!,
		password: process.env.DB_PASS!,
		database: process.env.DB_NAME!,
		host: process.env.DB_HOST!,
		port: Number(process.env.DB_PORT!),
	},
} satisfies Config;
