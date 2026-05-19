import type { Template } from "@/utils/types/templates";
import type { Dispatch, SetStateAction } from "react";
import type { clientesEnRuta, dataUsar } from "./send";

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

export interface MessageListProps {
	messages: Message[];
	onRemove: (id: string) => void;
}

// Mapea plantillas a estados
export const getTargetStatusForTemplate = (templateName: string) => {
	switch (templateName) {
		case "pedidos_no_planeados2":
			return "No planeados";
		case "pedidos_retrasados":
			return "Aplazados";
		case "pedidosenrutados":
			return "En ruta";
		default:
			return "enRuta";
	}
};

export interface PreviewSendComponentProps {
	hasVars: boolean;
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
	canSend: () => boolean;
	handleSendMessage: () => Promise<void>;
	isSubmitting: boolean;
	recipients: string[];
	dataClientesRuta: clientesEnRuta[];
	selectedTemplate: string;
}

export interface ContentForSendProps {
	resultados: any;
	handleNewSend: () => void;
	handleTemplateChange: (templateId: string) => void;
	selectedTemplate: string;
	templates: Template[];
	currentTemplate: Template | null;
	dataMensajes: dataUsar[] | null;
	getRecipientCount: () => number;
	getTargetStatusForTemplate: (templateName: string) => string;
}

export interface SendViewComponentProps {
	canSend: () => boolean;
	currentTemplate: Template | null;
	dataClientesRuta: clientesEnRuta[];
	dataMensajes: dataUsar[] | null;
	getRecipientCount: () => number;
	getTargetStatusForTemplate: (templateName: string) => string;
	handleCreateTemplate: () => void;
	handleNewSend: () => void;
	handleSendMessage: () => void;
	handleTemplateChange: (templateId: string) => void;
	hasVars: boolean;
	isSubmitting: boolean;
	recipients: string[];
	resultados: any;
	selectedTemplate: string;
	setShowCreateModal: Dispatch<SetStateAction<boolean>>;
	setVariableValues: Dispatch<SetStateAction<Record<string, string>>>;
	showCreateModal: boolean;
	templates: Template[];
	variableValues: Record<string, string>;
	vars: any;
	cancel: () => void;
	completed: boolean;
	currentBatch: number;
	error: string | null;
	isCancelled: boolean;
	isPaused: boolean;
	isProcessing: boolean;
	pause: () => void;
	progress: number;
	reset: () => void;
	resume: () => void;
	totalBatches: number;
	flyingMessages: any[];
}
