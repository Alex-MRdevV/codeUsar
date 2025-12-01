import type { Template } from "@/utils/types/templates";
import type { ApiResponse } from "@/utils/types/providers/meta";

export interface EventDetailsProps {
	event: {
		message: string;
		error?: string;
		metadata?: Record<string, any>;
	};
}

export interface MessageInputProps {
	message: string;
	onMessageChange: (message: string) => void;
}

export interface CreateTemplateModalProps {
	onClose: () => void;
	onSuccess: (template: Template) => void;
}

export interface ResultsCardProps {
	resultados: ApiResponse; // Permitir que `resultados` sea null
	onClose: () => void;
}
