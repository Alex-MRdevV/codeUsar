CREATE TABLE `MessageHistory` (
	`id` text PRIMARY KEY NOT NULL,
	`templateId` text(100),
	`phone` text NOT NULL,
	`status` text DEFAULT 'Pendiente',
	`failureReason` text,
	`send_date` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`templateId`) REFERENCES `Templates`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_history_template_date` ON `MessageHistory` (`templateId`,`send_date`);--> statement-breakpoint
CREATE INDEX `idx_history_status` ON `MessageHistory` (`status`);--> statement-breakpoint
CREATE INDEX `idx_history_phone` ON `MessageHistory` (`phone`);--> statement-breakpoint
ALTER TABLE `HistoryGeneral` ADD `messagesAlcanzados` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `HistoryGeneral` DROP COLUMN `phoneNumber`;