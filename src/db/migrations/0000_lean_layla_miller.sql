CREATE TABLE `Cliente` (
	`id` text PRIMARY KEY NOT NULL,
	`numeroCliente` text NOT NULL,
	`primerNombre` text NOT NULL,
	`telefono` text NOT NULL,
	`documento` text NOT NULL,
	`estado` text DEFAULT 'activo',
	CONSTRAINT "telefono_length_check" CHECK(LENGTH("Cliente"."telefono") = 10),
	CONSTRAINT "documento_length_check" CHECK(LENGTH("Cliente"."documento") BETWEEN 7 AND 10)
);
--> statement-breakpoint
CREATE INDEX `estado_cliente_idx` ON `Cliente` (`estado`);--> statement-breakpoint
CREATE TABLE `Clients_Pedido` (
	`id` text PRIMARY KEY NOT NULL,
	`cliente` text,
	`pedido` text,
	FOREIGN KEY (`cliente`) REFERENCES `Cliente`(`id`) ON UPDATE set null ON DELETE no action,
	FOREIGN KEY (`pedido`) REFERENCES `Pedido`(`id`) ON UPDATE set null ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Messages` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`templateId` text,
	`clientId` text,
	`status` text DEFAULT 'enviado',
	`sentAt` integer NOT NULL,
	`readAt` integer,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`templateId`) REFERENCES `Templates`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`clientId`) REFERENCES `Cliente`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `userId_idx` ON `Messages` (`userId`);--> statement-breakpoint
CREATE INDEX `sentAt_idx` ON `Messages` (`sentAt`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `Messages` (`status`);--> statement-breakpoint
CREATE TABLE `Pedido` (
	`id` text PRIMARY KEY NOT NULL,
	`nombre` text NOT NULL,
	`cantidadCajas` integer NOT NULL,
	`estado` text DEFAULT 'Por entregar'
);
--> statement-breakpoint
CREATE INDEX `estado_pedido_idx` ON `Pedido` (`estado`);--> statement-breakpoint
CREATE TABLE `Templates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`count` integer DEFAULT 0,
	`color` text,
	`content` text NOT NULL,
	`metaTemplateId` text,
	`variables` text,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Templates_name_unique` ON `Templates` (`name`);--> statement-breakpoint
CREATE TABLE `UserStats` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text,
	`totalMessagesSent` integer DEFAULT 0,
	`totalTimeSavedHours` integer DEFAULT 0,
	`totalContacts` integer DEFAULT 0,
	`lastUpdated` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` text PRIMARY KEY NOT NULL,
	`correo` text NOT NULL,
	`password` text NOT NULL,
	`primerNombre` text NOT NULL,
	`estado` text DEFAULT 'activo',
	`rol` text NOT NULL,
	`secretUserJWT` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `User_correo_unique` ON `User` (`correo`);--> statement-breakpoint
CREATE INDEX `estado_user_idx` ON `User` (`estado`);--> statement-breakpoint
CREATE INDEX `correo_user_idx` ON `User` (`correo`);
