CREATE TABLE `Client` (
	`id` varchar(100) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`document` varchar(20) NOT NULL,
	`name` varchar(100) NOT NULL,
	`cashless` enum('Si','No') DEFAULT 'No',
	CONSTRAINT `Client_id` PRIMARY KEY(`id`),
	CONSTRAINT `phone_check` CHECK(`Client`.`phone` = 10)
);
--> statement-breakpoint
CREATE TABLE `HistoryGeneral` (
	`id` varchar(100) NOT NULL,
	`messagesSend` int DEFAULT 0,
	`templateId` text,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `HistoryGeneral_id` PRIMARY KEY(`id`),
	CONSTRAINT `messagesSend_positive` CHECK(`HistoryGeneral`.`messagesSend` >= 0)
);
--> statement-breakpoint
CREATE TABLE `Interviewer` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(100) NOT NULL,
	`created_at` timestamp,
	CONSTRAINT `Interviewer_id` PRIMARY KEY(`id`),
	CONSTRAINT `Interviewer_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `Templates` (
	`id` varchar(191) NOT NULL,
	`name` varchar(255) NOT NULL,
	`icon` varchar(50) NOT NULL,
	`color` varchar(20),
	`meta_template_id` varchar(191),
	`meta_status` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
	`header_type` enum('TEXT','IMAGE','VIDEO','DOCUMENT','NONE') DEFAULT 'NONE',
	`header_text` text,
	`body_text` text NOT NULL,
	`footer_text` varchar(60),
	`variables` json,
	`buttons` json,
	`usage_count` int NOT NULL DEFAULT 0,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Templates_id` PRIMARY KEY(`id`),
	CONSTRAINT `Templates_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`password` varchar(191) NOT NULL,
	`created_at` timestamp,
	CONSTRAINT `User_id` PRIMARY KEY(`id`),
	CONSTRAINT `User_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `HistoryGeneral` ADD CONSTRAINT `HistoryGeneral_templateId_Templates_id_fk` FOREIGN KEY (`templateId`) REFERENCES `Templates`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_phone_client` ON `Client` (`phone`);--> statement-breakpoint
CREATE INDEX `idx_history_template` ON `HistoryGeneral` (`templateId`);--> statement-breakpoint
CREATE INDEX `idx_interviewer_email` ON `Interviewer` (`email`);--> statement-breakpoint
CREATE INDEX `idx_template_status` ON `Templates` (`meta_status`);--> statement-breakpoint
CREATE INDEX `idx_template_name` ON `Templates` (`name`);--> statement-breakpoint
CREATE INDEX `idx_user_email` ON `User` (`email`);