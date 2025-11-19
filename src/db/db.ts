import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

//pool de conexión con los datos de Hostinger
const pool = mysql.createPool({
	host: process.env.HOST!,
	port: Number(process.env.DB_PORT),
	user: process.env.USER,
	password: process.env.PASSWORD!,
	database: process.env.DATABASE!,
	waitForConnections: true,
	connectionLimit: 10,
});

export const db = drizzle(pool);
