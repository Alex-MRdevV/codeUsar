import type {
	ReplyFreeTextMessageRequest,
	SendFreeTextMessageRequest,
	SendMessageRequest,
} from "@/utils/types/providers/meta";
import type { Template } from "@/utils/types/templates";

export type TemplateVars = Record<string, string>;

export interface clientesEnRuta {
	phoneNumber: string;
	horaInicial: string;
	horaFinal: string;
	tipoMensaje: "pedidosEnRUTADOS";
}

export interface dataUsar {
	name: string;
	phone: string;
	typeMessage:
		| "pedidos_no_planeados"
		| "pedidos_retrasados"
		| "bavaria_now_confirmar"
		| "pedidosEnRUTADOS";
}

export interface UseSendMessagesLogicProps {
	currentTemplate: Template | null;
	dataClientesRuta: clientesEnRuta[] | null;
	dataMensajes: dataUsar[] | null;
	selectedTemplate: string;
	variableValues: Record<string, string>;
}

export interface UseSendMessageProps {
	buildPayload: (
		recipient: string
	) =>
		| SendMessageRequest
		| SendFreeTextMessageRequest
		| ReplyFreeTextMessageRequest;
	recipients: string[];
	alcance: "Masivo" | "individual";
	type: "template" | "text";
}

export interface UseFreeTextMessagesProps {
	recipients?: string[];
	content: string;
	previewUrl?: boolean;
	replyToMessageId?: string;
}
