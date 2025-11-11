ALTER TABLE `WhatsAppConfig` RENAME COLUMN "productionPhoneNumberId" TO "productionPhoneId";--> statement-breakpoint
ALTER TABLE `WhatsAppConfig` ADD `productionPhoneName` text NOT NULL;--> statement-breakpoint
ALTER TABLE `WhatsAppConfig` ADD `previewPhoneId` text;--> statement-breakpoint
ALTER TABLE `WhatsAppConfig` ADD `previewPhoneNumber` text;--> statement-breakpoint
ALTER TABLE `WhatsAppConfig` ADD `previewPhoneName` text;--> statement-breakpoint
ALTER TABLE `WhatsAppConfig` ADD `developmentPhoneId` text;--> statement-breakpoint
ALTER TABLE `WhatsAppConfig` ADD `developmentPhoneNumber` text;--> statement-breakpoint
ALTER TABLE `WhatsAppConfig` ADD `developmentPhoneName` text;--> statement-breakpoint
ALTER TABLE `WhatsAppConfig` DROP COLUMN `testPhoneNumberId`;--> statement-breakpoint
ALTER TABLE `WhatsAppConfig` DROP COLUMN `testPhoneNumber`;--> statement-breakpoint
ALTER TABLE `WhatsAppConfig` DROP COLUMN `wabaId`;