export interface FlyingMessage {
	id: string;
	recipient: string;
	status?: "sending" | "sent" | "error";
	errorCode?: number;
}

export interface MessagesFlyingCardsProps {
	messages: FlyingMessage[];
}

export interface MessagesFlyingSendCardsProps {
	messages: FlyingMessage[];
}
