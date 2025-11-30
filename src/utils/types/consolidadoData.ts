export type DataByStatusRuta = {
	enRuta: {
		idCliente: string;
		nameEstablecimiento?: string | undefined;
		phoneNumber: string;
		Estado: "EN RUTA" | "SEGUNDO VIAJE" | "APLAZADO";
		clienteId: string;
		horaInicial: string;
		horaFinal: string;
	}[];
	segundoViaje: {
		idCliente: string;
		nameEstablecimiento?: string | undefined;
		phoneNumber: string;
		Estado: "EN RUTA" | "SEGUNDO VIAJE" | "APLAZADO";
		clienteId: string;
		horaInicial: string;
		horaFinal: string;
	}[];
	aplazado: {
		idCliente: string;
		nameEstablecimiento?: string | undefined;
		phoneNumber: string;
		Estado: "EN RUTA" | "SEGUNDO VIAJE" | "APLAZADO";
		clienteId: string;
		horaInicial: string;
		horaFinal: string;
	}[];
};

export type ResultadoAgrupado = {
	byStatus: DataByStatusRuta;
	summary: {
		total: number;
		valid: number;
		invalid: number;
		enRuta: number;
		segundoViaje: number;
		aplazado: number;
	};
	invalidRows: Array<{
		row: number;
		errors: string[];
	}>;
};
