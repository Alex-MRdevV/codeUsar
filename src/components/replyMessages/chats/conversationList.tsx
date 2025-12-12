import { Input } from "@/components/ui/input"
import { getStatusColor, type ConversationsListProps } from "@/utils/types/chats"
import { Search } from "lucide-react"

export const ConversationsList = ({ conversations, selectedId, onSelectConversation }: ConversationsListProps) => {
	const sorted = [...conversations].sort((a, b) => {
		const dateA = new Date(a.lastMessageDate).getTime()
		const dateB = new Date(b.lastMessageDate).getTime()
		return dateB - dateA
	})

	return (
		<>
			<section className="p-4 border-b border-border sticky top-0 bg-card">
				<div className="relative">
					<Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input placeholder="Buscar conversaciones..." className="pl-9 bg-background border-border" />
				</div>
			</section>

			<article className="flex-1 overflow-y-auto">
				{sorted.map((conversation) => (
					<button
						key={conversation.id}
						onClick={() => onSelectConversation(conversation)}
						className={`w-full text-left p-4 border-b border-border/50 transition-colors hover:bg-background/50 ${selectedId === conversation.id ? "bg-background border-l-2 border-l-primary" : ""
							}`}
					>
						<div className="flex items-start justify-between gap-3 mb-2">
							<div className="flex-1 min-w-0">
								<p className="font-medium text-foreground truncate">{conversation.name || conversation.phoneNumber}</p>
								<p className="text-xs text-muted-foreground truncate">{conversation.phoneNumber}</p>
							</div>
							<span
								className={`text-xs px-2 py-1 rounded whitespace-nowrap ${getStatusColor(conversation.conversationStatus)}`}
							>
								{conversation.conversationStatus}
							</span>
						</div>
						<p className="text-sm text-muted-foreground truncate mb-2">
							{conversation.messages[conversation.messages.length - 1]?.content || "Sin mensajes"}
						</p>
						<p className="text-xs text-muted-foreground">
							{new Date(conversation.lastMessageDate).toLocaleTimeString("es-ES", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</p>
					</button>
				))}
			</article>
		</>
	)
}
