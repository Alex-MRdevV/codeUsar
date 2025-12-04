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
ALTER TABLE `HistoryGeneral` ADD `phoneNumber` text(20);--> statement-breakpoint
ALTER TABLE `consolidated_clients` DROP COLUMN `clienteId`;--> statement-breakpoint
ALTER TABLE `consolidated_clients` DROP COLUMN `status`;