CREATE TABLE `MessageHistory` (
	`id` text PRIMARY KEY NOT NULL,
	`templateId` text,
	`direction` text NOT NULL,
	`messageType` text NOT NULL,
	`whatsappMessageId` text,
	`phone` text NOT NULL,
	`contactName` text,
	`content` text,
	`mediaUrl` text,
	`mediaType` text,
	`status` text,
	`failureReason` text,
	`sentAt` text,
	`deliveredAt` text,
	`readAt` text,
	`failedAt` text,
	`conversationWindowExpiry` text,
	`messageContext` text,
	`conversationId` text,
	`conversationOrigin` text,
	`metadata` text,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`templateId`) REFERENCES `Templates`(`id`) ON UPDATE no action ON DELETE set null
);

CREATE UNIQUE INDEX `MessageHistory_whatsappMessageId_unique` ON `MessageHistory` (`whatsappMessageId`);

CREATE INDEX `idx_message_context` ON `MessageHistory` (`messageContext`);

CREATE INDEX `idx_message_timestamp` ON `MessageHistory` (`timestamp`);

CREATE INDEX `idx_whatsapp_message_id` ON `MessageHistory` (`whatsappMessageId`);

CREATE INDEX `idx_message_direction` ON `MessageHistory` (`direction`);

CREATE INDEX `idx_message_status` ON `MessageHistory` (`status`);

CREATE INDEX `idx_phone` ON `MessageHistory` (`phone`);
