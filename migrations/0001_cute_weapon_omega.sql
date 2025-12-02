CREATE TABLE `bavaria_clients` (
	`clienteId` text PRIMARY KEY NOT NULL,
	`nombre` text
);
--> statement-breakpoint
CREATE TABLE `consolidated_clients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`phoneNumber` text NOT NULL,
	`clienteId` text NOT NULL,
	`nameEstablecimiento` text,
	`horaInicial` text,
	`horaFinal` text,
	`status` text NOT NULL
);
