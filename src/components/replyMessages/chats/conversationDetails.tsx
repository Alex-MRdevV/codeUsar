import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ConversationDetailProps } from "@/utils/types/chats"
import { Send } from "lucide-react"
import { useState } from "react"

export function ConversationDetail({ conversation, onSendReply }: ConversationDetailProps) {
	const [reply, setReply] = useState("")

	const handleSend = () => {
		if (reply.trim()) {
			onSendReply(conversation.id, reply)
			setReply("")
		}
	}

	const getMessageStatusIcon = (status: string) => {
		switch (status) {
			case "read":
				return "✓✓"
			case "delivered":
				return "✓"
			case "sent":
				return "⏱"
			case "failed":
				return "✕"
			default:
				return ""
		}
	}

	const getMessageStatusColor = (status: string, direction: string) => {
		if (direction === "inbound") return "text-muted-foreground"
		switch (status) {
			case "read":
				return "text-blue-600 dark:text-blue-400"
			case "delivered":
				return "text-gray-600 dark:text-gray-400"
			case "sent":
				return "text-gray-500 dark:text-gray-500"
			case "failed":
				return "text-red-600 dark:text-red-400"
			default:
				return "text-muted-foreground"
		}
	}

	const isWindow24hActive = conversation.lastResponseDate
		? new Date().getTime() - new Date(conversation.lastResponseDate).getTime() < 24 * 60 * 60 * 1000
		: false

	return (
		<div className="flex flex-col h-full">
			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-6 space-y-4">
				{conversation.messages.map((message) => (
					<div key={message.id} className={`flex ${message.direction === "inbound" ? "justify-start" : "justify-end"}`}>
						<div
							className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.direction === "inbound"
								? "bg-muted text-muted-foreground rounded-bl-none"
								: "bg-primary text-primary-foreground rounded-br-none"
								}`}
						>
							<p className="text-sm">{message.content}</p>
							<div className="flex items-center justify-between gap-2 mt-1">
								<p className="text-xs opacity-70">
									{new Date(message.timestamp).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
								</p>
								{message.direction === "outbound" && (
									<span className={`text-xs font-bold ${getMessageStatusColor(message.status as string, message.direction)}`}>
										{getMessageStatusIcon(message.status as string)}
									</span>
								)}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Input area */}
			<div className="border-t border-border bg-card p-4">
				{!isWindow24hActive && (
					<div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
						<p className="text-xs text-red-600 dark:text-red-400 font-medium">
							⚠️ Ventana de 24h cerrada. No puedes responder sin que el cliente inicie la conversación.
						</p>
					</div>
				)}

				<div className="flex gap-2">
					<Input
						placeholder="Escribe tu respuesta..."
						value={reply}
						onChange={(e) => setReply(e.target.value)}
						disabled={!isWindow24hActive}
						className="bg-background border-border disabled:opacity-50"
					/>
					<Button
						onClick={handleSend}
						disabled={!reply.trim() || !isWindow24hActive}
						size="icon"
						className="bg-primary hover:bg-primary/90"
					>
						<Send className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}
