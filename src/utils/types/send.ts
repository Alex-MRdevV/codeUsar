import type {
	ReplyFreeTextMessageRequest,
	SendFreeTextMessageRequest,
	SendMessageRequest,
} from "./providers/meta";

export interface UseSendMessageProps {
	buildPayload: (
		recipient: string
	) =>
		| SendMessageRequest
		| SendFreeTextMessageRequest
		| ReplyFreeTextMessageRequest;
	recipients: string[];
}
