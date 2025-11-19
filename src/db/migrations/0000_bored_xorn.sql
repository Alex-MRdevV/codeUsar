CREATE TABLE `Client` (
	`id` varchar(100) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`document` varchar(20) NOT NULL,
	`name` varchar(100) NOT NULL,
	`cashless` enum('Si','No') DEFAULT 'No',
	CONSTRAINT `Client_id` PRIMARY KEY(`id`)
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
CREATE TABLE `Orders` (
	`id` varchar(191) NOT NULL,
	`contact_id` varchar(191),
	`order_number` varchar(50) NOT NULL,
	`total_amount` decimal(10,2) NOT NULL,
	`status` enum('Rechazado','Confirmado','Pendiente','Aplazado') DEFAULT 'Pendiente',
	`rejection_code` enum('ZP','Z6','ZR','ZH','ZL','Z4','99','ZS','ZE','Z3','16','10','MC','MT'),
	`order_date` timestamp NOT NULL,
	`delivery_date` timestamp,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `Orders_order_number_unique` UNIQUE(`order_number`)
);
--> statement-breakpoint
CREATE TABLE `Order_items` (
	`id` varchar(191) NOT NULL,
	`order_id` varchar(191),
	`name` varchar(191) NOT NULL,
	`quantity` int,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Order_items_id` PRIMARY KEY(`id`),
	CONSTRAINT `Order_items_name_unique` UNIQUE(`name`)
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
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Templates_id` PRIMARY KEY(`id`),
	CONSTRAINT `Templates_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `User_stats` (
	`id` varchar(191) NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`total_messages_sent` int NOT NULL DEFAULT 0,
	`total_contacts` int NOT NULL DEFAULT 0,
	`total_orders` int NOT NULL DEFAULT 0,
	`total_time_saved_hours` int NOT NULL DEFAULT 0,
	`last_message_at` timestamp,
	`last_updated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `User_stats_id` PRIMARY KEY(`id`),
	CONSTRAINT `User_stats_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`status` enum('activo','retirado') DEFAULT 'activo',
	`created_at` timestamp,
	CONSTRAINT `User_id` PRIMARY KEY(`id`),
	CONSTRAINT `User_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_contact_id_Client_id_fk` FOREIGN KEY (`contact_id`) REFERENCES `Client`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Order_items` ADD CONSTRAINT `Order_items_order_id_Orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `Orders`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `User_stats` ADD CONSTRAINT `User_stats_user_id_User_id_fk` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_interviewer_email` ON `Interviewer` (`email`);--> statement-breakpoint
CREATE INDEX `idx_order_status` ON `Orders` (`status`);--> statement-breakpoint
CREATE INDEX `idx_order_date` ON `Orders` (`order_date`);--> statement-breakpoint
CREATE INDEX `idx_order_number` ON `Orders` (`order_number`);--> statement-breakpoint
CREATE INDEX `idx_order_items_name` ON `Order_items` (`name`);--> statement-breakpoint
CREATE INDEX `idx_template_status` ON `Templates` (`meta_status`);--> statement-breakpoint
CREATE INDEX `idx_template_name` ON `Templates` (`name`);--> statement-breakpoint
CREATE INDEX `idx_user_status` ON `User` (`status`);--> statement-breakpoint
CREATE INDEX `idx_user_email` ON `User` (`email`);