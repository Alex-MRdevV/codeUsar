export const nameTemplates = [
	"confirmacion_entrega_pedidos",
	"confirmacion_reasignacion_entregas",
	"delivery_confirmation_4",
];

export const clasesContactos = ["Todos los contactos", "Clientes"];

export type PhoneType = "production" | "preview" | "development";

export interface PhoneData {
	id: string;
	number: string;
	name: string;
	type: PhoneType;
}

export interface PropsListPhone {
	phonesArray: PhoneData[];
	selectedId: string | null;
	onSelectPhone: (id: string) => void;
	onCopyPhone: (number: string) => void;
}

export interface PhoneData {
	id: string;
	number: string;
	name: string;
	type: PhoneType;
}

export interface MessageReplicar {
  id: string
  from: string
  fromPhone: string
  message: string
  timestamp: Date
  hasReply: boolean
  replyMessage?: string
  replyTime?: Date
}
