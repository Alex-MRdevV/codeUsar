PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Cliente` (
	`id` text PRIMARY KEY NOT NULL,
	`numeroCliente` text NOT NULL,
	`primerNombre` text NOT NULL,
	`telefono` text NOT NULL,
	`documento` text NOT NULL,
	`estado` text DEFAULT 'activo',
	CONSTRAINT "telefono_length_check" CHECK(LENGTH("__new_Cliente"."telefono") = 10),
	CONSTRAINT "documento_length_check" CHECK(LENGTH("__new_Cliente"."documento") BETWEEN 7 AND 10)
);
--> statement-breakpoint
INSERT INTO `__new_Cliente`("id", "numeroCliente", "primerNombre", "telefono", "documento", "estado") SELECT "id", "numeroCliente", "primerNombre", "telefono", "documento", "estado" FROM `Cliente`;--> statement-breakpoint
DROP TABLE `Cliente`;--> statement-breakpoint
ALTER TABLE `__new_Cliente` RENAME TO `Cliente`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `estado_cliente_idx` ON `Cliente` (`estado`);--> statement-breakpoint
ALTER TABLE `Templates` ADD `structure` text NOT NULL;--> statement-breakpoint
ALTER TABLE `Templates` ADD `status` text DEFAULT 'PENDING';