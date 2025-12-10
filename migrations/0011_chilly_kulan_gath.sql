CREATE TABLE `Clients` (
	`id` text PRIMARY KEY NOT NULL,
	`phoneNumber` text NOT NULL,
	`name` text,
	`conversationStatus` text DEFAULT 'new',
	`firstContactDate` text,
	`lastMessageDate` text,
	`lastResponseDate` text,
	`totalMessagesSent` integer DEFAULT 0,
	`totalMessagesReceived` integer DEFAULT 0,
	`tags` text,
	`notes` text,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `idx_client_phone` ON `Clients` (`phoneNumber`);--> statement-breakpoint
CREATE INDEX `idx_client_conversation_status` ON `Clients` (`conversationStatus`);--> statement-breakpoint
CREATE INDEX `idx_client_last_message` ON `Clients` (`lastMessageDate`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_MessageHistory` (
	`id` text PRIMARY KEY NOT NULL,
	`clientId` text,
	`templateId` text,
	`direction` text NOT NULL,
	`messageType` text NOT NULL,
	`whatsappMessageId` text,
	`phone` text NOT NULL,
	`content` text,
	`mediaUrl` text,
	`mediaType` text,
	`status` text,
	`failureReason` text,
	`conversationWindowExpiry` text,
	`messageContext` text,
	`metadata` text,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`clientId`) REFERENCES `Clients`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`templateId`) REFERENCES `Templates`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_MessageHistory`("id", "clientId", "templateId", "direction", "messageType", "whatsappMessageId", "phone", "content", "mediaUrl", "mediaType", "status", "failureReason", "conversationWindowExpiry", "messageContext", "metadata", "timestamp") SELECT "id", "clientId", "templateId", "direction", "messageType", "whatsappMessageId", "phone", "content", "mediaUrl", "mediaType", "status", "failureReason", "conversationWindowExpiry", "messageContext", "metadata", "timestamp" FROM `MessageHistory`;--> statement-breakpoint
DROP TABLE `MessageHistory`;--> statement-breakpoint
ALTER TABLE `__new_MessageHistory` RENAME TO `MessageHistory`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `MessageHistory_whatsappMessageId_unique` ON `MessageHistory` (`whatsappMessageId`);--> statement-breakpoint
CREATE INDEX `idx_message_client` ON `MessageHistory` (`clientId`);--> statement-breakpoint
CREATE INDEX `idx_message_context` ON `MessageHistory` (`messageContext`);--> statement-breakpoint
CREATE INDEX `idx_message_timestamp` ON `MessageHistory` (`timestamp`);--> statement-breakpoint
CREATE INDEX `idx_conversation_thread` ON `MessageHistory` (`clientId`,`timestamp`);--> statement-breakpoint
CREATE INDEX `idx_whatsapp_message_id` ON `MessageHistory` (`whatsappMessageId`);--> statement-breakpoint
CREATE INDEX `idx_message_direction` ON `MessageHistory` (`direction`);--> statement-breakpoint
DROP INDEX `idx_user_status`;--> statement-breakpoint
DROP INDEX `idx_user_role`;--> statement-breakpoint
ALTER TABLE `User` DROP COLUMN `status`;--> statement-breakpoint
ALTER TABLE `User` DROP COLUMN `role`;