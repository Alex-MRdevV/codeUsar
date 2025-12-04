CREATE TABLE `HistoryEnfocado` (
	`id` text PRIMARY KEY NOT NULL,
	`messagesSend` integer DEFAULT 0,
	`templateId` text(100),
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`templateId`) REFERENCES `Templates`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "messagesSend_positive" CHECK("HistoryEnfocado"."messagesSend" >= 0)
);
--> statement-breakpoint
CREATE INDEX `idx_history_template` ON `HistoryEnfocado` (`templateId`);--> statement-breakpoint
DROP INDEX "idx_history_template";--> statement-breakpoint
DROP INDEX "Templates_name_unique";--> statement-breakpoint
DROP INDEX "idx_template_status";--> statement-breakpoint
DROP INDEX "idx_template_name";--> statement-breakpoint
ALTER TABLE `Templates` ALTER COLUMN "color" TO "color" text;--> statement-breakpoint
CREATE INDEX `idx_history_template` ON `HistoryGeneral` (`templateId`);--> statement-breakpoint
CREATE UNIQUE INDEX `Templates_name_unique` ON `Templates` (`name`);--> statement-breakpoint
CREATE INDEX `idx_template_status` ON `Templates` (`metaStatus`);--> statement-breakpoint
CREATE INDEX `idx_template_name` ON `Templates` (`name`);--> statement-breakpoint
ALTER TABLE `Templates` DROP COLUMN `usage_count`;--> statement-breakpoint
ALTER TABLE `consolidated_clients` DROP COLUMN `clienteId`;--> statement-breakpoint
ALTER TABLE `consolidated_clients` DROP COLUMN `status`;