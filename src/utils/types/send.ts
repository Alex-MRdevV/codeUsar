import type {
	ReplyFreeTextMessageRequest,
	SendFreeTextMessageRequest,
	SendMessageRequest,
} from "@/utils/types/providers/meta";
import type { Template } from "@/utils/types/templates";
import type { Dispatch, SetStateAction } from "react";
import type { Message } from "./messages";

export type TemplateVars = Record<string, string>;

export type UseMessagesLogicProps =
	| ({
			type: "template";
	  } & UseSendMessagesLogicProps)
	| ({
			type: "text";
	  } & UseFreeTextMessagesProps);

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
		| "pedidos_no_planeados2"
		| "pedidos_retrasados"
		| "bavaria_now_confirmar"
		| "pedidosEnRUTADOS";
}

export type MessageData =
	| SendMessageRequest
	| SendFreeTextMessageRequest
	| ReplyFreeTextMessageRequest;

export interface ValidationError {
	message: string;
	status: number;
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
	type: "template" | "text";
}

export interface UseFreeTextMessagesProps {
	recipients?: string[];
	content: string;
	previewUrl?: boolean;
	replyToMessageId?: string;
}

export interface PreviewSectionProps {
	resultados: any;
	currentTemplate: Template | null;
	recipients: string[];
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
}

export interface AddMessageFormProps {
	isManual: boolean;
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

export interface SectionMainProps {
	isManual: boolean;
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
	handleSendMessagesWrapper: () => Promise<void>;
	getRecipientCount: () => number;
	isSubmitting: boolean;
	recipients: string[];
	canSend: () => boolean;
	dataClientesRuta: clientesEnRuta[];
	uiMessages: Message[];
	removeFromOriginalSource: (id: string) => void;
}

export interface SectionConsolidadoProps {
	resultados: any;
	currentTemplate: Template | null;
	recipients: string[];
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
	handleNewSend: () => void;
	handleSendMessagesWrapper: () => Promise<void>;
	getRecipientCount: () => number;
	isSubmitting: boolean;
	canSend: () => boolean;
	dataClientesRuta: clientesEnRuta[];
	isManual: boolean;
	templates: Template[];
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
	uiMessages: Message[];
	removeFromOriginalSource: (id: string) => void;
}

export interface UseTemplateMessageBuilderProps {
	template: Template | null;
	variableValues: Record<string, string>;
}

export interface UseBulkMessageBuilderProps {
	template: Template | null;
	recipients: Array<{
		phone: string;
		variables: Record<string, string>;
	}>;
}
