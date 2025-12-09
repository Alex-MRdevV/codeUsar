export interface FlyingMessage {
	id: string
	recipient: string
	status: "sending" | "sent" | "error"
	errorCode?: number
	timestamp: number
}

export interface MessagesFlyingCardsProps {
	messages: FlyingMessage[]
	isActive: boolean
}

export interface MessagesFlyingSendCardsProps {
	messages: FlyingMessage[]
}
