import type { FlyingMessage } from "@/utils/types/flyingCards";
import type { Template } from "@/utils/types/templates";
import type { Dispatch, SetStateAction } from "react";

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
		| "bavaria_now_confirmar"
		| "pedidos_in_ruta"
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

export interface Message {
	id: string;
	phone: string;
	name?: string;
	content: string;
}

export interface MessageCardProps {
	message: Message;
	onRemove: (id: string) => void;
	index: number;
}

export interface AddMessageFormContainerProps {
	templates: Template[];
	getTargetStatusForTemplate: (
		templateName: string
	) =>
		| "aplazado"
		| "Reasignados"
		| "Para confirmar"
		| "enRuta"
		| "Viajes En piso";
}

export interface AddMessageFormProps {
	templates: Template[];
	currentTemplate: Template | null;
	selectedTemplate: string;
	handleTemplateChange: (templateId: string) => void;
	hasVariables: boolean | undefined;
	variableValues: Record<string, string>;
	handleVariableChange: (varName: string, value: string) => void;
	content: string;
	setContent: Dispatch<SetStateAction<string>>;
	name: string;
	setName: Dispatch<SetStateAction<string>>;
	setPhone: Dispatch<SetStateAction<string>>;
	phone: string;
	addManualMessage: () => void;
	addClientToRuta: () => void;
	addDataMessageTemplates: () => void;
}

export interface MessageListProps {
	messages: Message[];
	onRemove: (id: string) => void;
}

// Mapea plantillas a estados
export const getTargetStatusForTemplate = (templateName: string) => {
	switch (templateName) {
		case "pedidos_no_planeados":
			return "aplazado";
		case "pedidos_retrasados":
			return "Reasignados";
		case "bavaria_now_confirmar":
			return "Para confirmar";
		case "confirmacion_de_pedido":
			return "enRuta";
		default:
			return "enRuta";
	}
};

export interface SendViewComponentProps {
	setShowCreateModal: Dispatch<SetStateAction<boolean>>;
	resultados: any;
	handleNewSend: () => void;
	selectedTemplate: string;
	templates: Template[];
	dataMensajes: dataUsar[] | null;
	handleTemplateChange: (templateId: string) => void;
	getRecipientCount: () => number;
	hasVars: boolean;
	getTargetStatusForTemplate: (
		templateName: string
	) =>
		| "aplazado"
		| "Reasignados"
		| "Para confirmar"
		| "enRuta"
		| "Viajes En piso";
	currentTemplate: Template | null;
	vars: {
		format: "named" | "positional";
		params: Array<{
			name: string;
			placeholder: string;
			example: string;
			component: "header" | "body" | "footer";
		}>;
	} | null;
	variableValues: Record<string, string>;
	setVariableValues: Dispatch<SetStateAction<Record<string, string>>>;
	showCreateModal: boolean;
	canSend: () => boolean;
	handleSendMessage: () => Promise<void>;
	isSubmitting: boolean;
	recipients: string[];
	handleCreateTemplate: (newTemplate: Template) => Promise<void>;
	dataClientesRuta: clientsInRuta[];
	progress: number;
	isProcessing: boolean;
	completed: boolean;
	currentBatch: number;
	totalBatches: number;
	error: string | null;
	isCancelled: boolean;
	isPaused: boolean;
	cancel: () => void;
	pause: () => void;
	resume: () => void;
	reset: () => void;
	flyingMessages: FlyingMessage[];
}
