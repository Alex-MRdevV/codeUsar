CREATE TABLE `Clients` (
	`id` varchar(100) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`name` varchar(100) NOT NULL,
	`cashless` enum('Si','No') DEFAULT 'No',
	CONSTRAINT `Clients_id` PRIMARY KEY(`id`),
	CONSTRAINT `phone_check` CHECK(`Clients`.`phone` = 10)
);
--> statement-breakpoint
CREATE TABLE `HistoryGeneral` (
	`id` varchar(100) NOT NULL,
	`messagesSend` int DEFAULT 0,
	`templateId` varchar(100),
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `HistoryGeneral_id` PRIMARY KEY(`id`),
	CONSTRAINT `messagesSend_positive` CHECK(`HistoryGeneral`.`messagesSend` >= 0)
);
--> statement-breakpoint
CREATE TABLE `Interviewer` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(100) NOT NULL,
	`createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `Interviewer_id` PRIMARY KEY(`id`),
	CONSTRAINT `Interviewer_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `Orders` (
	`id` varchar(100) NOT NULL,
	`clientId` varchar(100),
	`orderNumber` varchar(50) NOT NULL,
	`status` enum('Rechazado','Confirmado','Pendiente','Aplazado') DEFAULT 'Pendiente',
	`rejectionCode` enum('ZP','Z6','ZR','ZH','ZL','Z4','99','ZS','ZE','Z3','16','10','MC','MT'),
	`orderDate` date NOT NULL,
	`notes` text,
	`createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `Orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `OrdersItems` (
	`id` varchar(100) NOT NULL,
	`orderId` varchar(100),
	`nameProduct` varchar(191) NOT NULL,
	`quantity` int,
	`notes` text,
	`createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `OrdersItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Templates` (
	`id` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`icon` varchar(50) NOT NULL,
	`color` varchar(20),
	`metaTemplateId` varchar(191),
	`metaStatus` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
	`headerType` enum('TEXT','IMAGE','VIDEO','DOCUMENT','NONE') DEFAULT 'NONE',
	`headerText` text,
	`bodyText` text NOT NULL,
	`footerText` varchar(60),
	`variables` json,
	`buttons` json,
	`dailyMessageCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Templates_id` PRIMARY KEY(`id`),
	CONSTRAINT `Templates_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
ALTER TABLE `HistoryGeneral` ADD CONSTRAINT `HistoryGeneral_templateId_Templates_id_fk` FOREIGN KEY (`templateId`) REFERENCES `Templates`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_clientId_Clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `Clients`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `OrdersItems` ADD CONSTRAINT `OrdersItems_orderId_Orders_id_fk` FOREIGN KEY (`orderId`) REFERENCES `Orders`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_phone_client` ON `Clients` (`phone`);--> statement-breakpoint
CREATE INDEX `idx_history_template` ON `HistoryGeneral` (`templateId`);--> statement-breakpoint
CREATE INDEX `idx_interviewer_email` ON `Interviewer` (`email`);--> statement-breakpoint
CREATE INDEX `idx_order_status` ON `Orders` (`status`);--> statement-breakpoint
CREATE INDEX `idx_order_date` ON `Orders` (`orderDate`);--> statement-breakpoint
CREATE INDEX `idx_order_number` ON `Orders` (`orderNumber`);--> statement-breakpoint
CREATE INDEX `idx_order_nameProduct` ON `OrdersItems` (`nameProduct`);--> statement-breakpoint
CREATE INDEX `idx_order_orderId` ON `OrdersItems` (`orderId`);--> statement-breakpoint
CREATE INDEX `idx_template_status` ON `Templates` (`metaStatus`);--> statement-breakpoint
CREATE INDEX `idx_template_name` ON `Templates` (`name`);