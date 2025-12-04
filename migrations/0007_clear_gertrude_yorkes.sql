CREATE TABLE `clientesEnRuta` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`phoneNumber` text NOT NULL,
	`horaInicial` text,
	`horaFinal` text,
	`tipoMensaje` text
);
