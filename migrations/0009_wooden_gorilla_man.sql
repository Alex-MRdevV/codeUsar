CREATE TABLE `User` (
	`id` text(100) PRIMARY KEY NOT NULL,
	`name` text(100) NOT NULL,
	`email` text(100) NOT NULL,
	`password` text(100) NOT NULL,
	`status` text DEFAULT 'activo',
	`role` text NOT NULL,
	`created_at` text DEFAULT ( DATETIME('now','localtime'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `User_email_unique` ON `User` (`email`);--> statement-breakpoint
CREATE INDEX `idx_user_status` ON `User` (`status`);--> statement-breakpoint
CREATE INDEX `idx_user_email` ON `User` (`email`);--> statement-breakpoint
CREATE INDEX `idx_user_role` ON `User` (`role`);