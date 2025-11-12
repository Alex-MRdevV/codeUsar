CREATE TABLE `Templates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`count` integer DEFAULT 0,
	`color` text,
	`content` text NOT NULL,
	`metaTemplateId` text,
	`structure` text NOT NULL,
	`variables` text,
	`createdAt` integer NOT NULL,
	`status` text DEFAULT 'PENDING'
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