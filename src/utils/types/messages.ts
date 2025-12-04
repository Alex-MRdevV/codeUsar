export interface clientsInRuta {
	phoneNumber: string;
	horaInicial: string;
	horaFinal: string;
	tipoMensaje: "confirmacion_de_pedido";
}

export interface ClientsInRutaResponse {
  data: clientsInRuta[];
}

export interface dataUsar {
	name: string;
	phone: string;
	typeMessage:
		| "pedidos_no_planeados"
		| "pedidos_retrasados"
		| "confirmar_pedido"
		| "confirmacion_de_pedido";
}

export interface ExcelRow {
	Nombre: string;
	Celular: string;
	[key: string]: unknown;
}

export interface ExcelRowRutas {
	Nombre: string;
	Celular: string;
	"Hora inicial": string;
	"Hora Final": string;
	[key: string]: unknown;
}
