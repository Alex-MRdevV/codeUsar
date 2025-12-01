CREATE TABLE `Clients` (
	`id` text(100) PRIMARY KEY NOT NULL,
	`name` text(100) NOT NULL,
	`phone` text(20) NOT NULL,
	`cashless` text DEFAULT 'No',
	CONSTRAINT "phone_check" CHECK("Clients"."phone" = 10)
);
--> statement-breakpoint
CREATE INDEX `idx_phone_client` ON `Clients` (`phone`);--> statement-breakpoint
CREATE TABLE `HistoryGeneral` (
	`id` text PRIMARY KEY NOT NULL,
	`messagesSend` integer DEFAULT 0,
	`templateId` text(100),
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`templateId`) REFERENCES `Templates`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "messagesSend_positive" CHECK("HistoryGeneral"."messagesSend" >= 0)
);
--> statement-breakpoint
CREATE INDEX `idx_history_template` ON `HistoryGeneral` (`templateId`);--> statement-breakpoint
CREATE TABLE `Interviewer` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Interviewer_email_unique` ON `Interviewer` (`email`);--> statement-breakpoint
CREATE INDEX `idx_interviewer_email` ON `Interviewer` (`email`);--> statement-breakpoint
CREATE INDEX `idx_interviewer_name` ON `Interviewer` (`name`);--> statement-breakpoint
CREATE TABLE `Orders` (
	`id` text PRIMARY KEY NOT NULL,
	`clientId` text,
	`orderNumber` text NOT NULL,
	`status` text DEFAULT 'Pendiente',
	`rejectionCode` text,
	`orderDate` text NOT NULL,
	`notes` text,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`clientId`) REFERENCES `Clients`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Orders_orderNumber_unique` ON `Orders` (`orderNumber`);--> statement-breakpoint
CREATE INDEX `idx_order_status` ON `Orders` (`status`);--> statement-breakpoint
CREATE INDEX `idx_order_date` ON `Orders` (`orderDate`);--> statement-breakpoint
CREATE INDEX `idx_order_number` ON `Orders` (`orderNumber`);--> statement-breakpoint
CREATE TABLE `OrdersItems` (
	`id` text PRIMARY KEY NOT NULL,
	`orderId` text,
	`nameProduct` text NOT NULL,
	`quantity` integer,
	`notes` text,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`orderId`) REFERENCES `Orders`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_order_nameProduct` ON `OrdersItems` (`nameProduct`);--> statement-breakpoint
CREATE INDEX `idx_order_orderId` ON `OrdersItems` (`orderId`);--> statement-breakpoint
CREATE TABLE `Templates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`color` text(20),
	`metaStatus` text DEFAULT 'PENDING',
	`headerType` text DEFAULT 'NONE',
	`header_text` text,
	`body_text` text NOT NULL,
	`footer_text` text(60),
	`variables` text,
	`buttons` text,
	`usage_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000),
	`updated_at` text DEFAULT ( DATETIME('now','localtime'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Templates_name_unique` ON `Templates` (`name`);--> statement-breakpoint
CREATE INDEX `idx_template_status` ON `Templates` (`metaStatus`);--> statement-breakpoint
CREATE INDEX `idx_template_name` ON `Templates` (`name`);