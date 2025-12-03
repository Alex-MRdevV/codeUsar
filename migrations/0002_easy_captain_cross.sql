CREATE TABLE `clientsMensajes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text,
	`phoneNumber` text NOT NULL,
	`tipoMensaje` text
);
--> statement-breakpoint
DROP TABLE `Clients`;--> statement-breakpoint
DROP TABLE `bavaria_clients`;--> statement-breakpoint
DROP TABLE `Interviewer`;--> statement-breakpoint
DROP TABLE `Orders`;--> statement-breakpoint
DROP TABLE `OrdersItems`;