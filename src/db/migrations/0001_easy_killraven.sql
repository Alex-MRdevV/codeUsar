CREATE TABLE `WhatsAppConfig` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text,
	`productionPhoneNumberId` text NOT NULL,
	`productionPhoneNumber` text NOT NULL,
	`testPhoneNumberId` text NOT NULL,
	`testPhoneNumber` text NOT NULL,
	`wabaId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `userId_whatsapp_idx` ON `WhatsAppConfig` (`userId`);