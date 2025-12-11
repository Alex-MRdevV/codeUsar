import { useState } from "react"
import { ConversationsList } from "@/components/replyMessages/chats/conversationList"
import { ConversationDetail } from "@/components/replyMessages/chats/conversationDetails"
import { GlobalMetrics } from "@/components/replyMessages/chats/globalMetrics"
import type { Conversation } from "@/utils/types/chats"
import { LoadingWrapper } from "@/components/loading/wrapper"
import { ReplyMessagesClientsContainer } from "@/components/replyMessages/chats/container"
import { HeaderReplyMessages } from "@/components/replyMessages/chats/header"
//<ConversationDetail conversation={selectedConversation} onSendReply={handleSendReply} />
export const ReplyMessagesClients = () => {
	const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
	const [conversations, setConversations] = useState<Conversation[] | null>([])

	if (!conversations) {
		return <LoadingWrapper isLoading={true} message="Cargando..." />
	}

	const { globalMetrics } = ReplyMessagesClientsContainer(conversations)

	return (
		<article className="h-screen flex flex-col bg-background">
			<HeaderReplyMessages
				globalMetrics={globalMetrics}
			/>

			<section className="flex-1 overflow-hidden flex">
				<div className="w-full md:w-80 border-r border-border bg-card overflow-y-auto flex flex-col">
					<ConversationsList
						conversations={conversations}
						selectedId={selectedConversation?.id}
						onSelectConversation={setSelectedConversation}
					/>
				</div>

				<div className="hidden md:flex md:flex-1 flex-col overflow-hidden">
					{selectedConversation ? (
						<>
							{/* Metrics for selected conversation */}
							<section className="p-6 border-b border-border bg-card">
								<h2 className="text-lg font-semibold mb-4 text-foreground">Métricas</h2>
								<section className="grid grid-cols-4 gap-4">
									<div className="bg-background rounded-lg p-3">
										<p className="text-xs text-muted-foreground mb-1">Enviados</p>
										<p className="text-2xl font-bold text-foreground">{selectedConversation.totalMessagesSent}</p>
									</div>
									<div className="bg-background rounded-lg p-3">
										<p className="text-xs text-muted-foreground mb-1">Recibidos</p>
										<p className="text-2xl font-bold text-foreground">{selectedConversation.totalMessagesReceived}</p>
									</div>
									<div className="bg-background rounded-lg p-3">
										<p className="text-xs text-muted-foreground mb-1">Estado</p>
										<p className="text-sm font-semibold">
											<span
												className={`px-2 py-1 rounded text-xs ${selectedConversation.conversationStatus === "active" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-gray-500/10 text-gray-600 dark:text-gray-400"}`}
											>
												{selectedConversation.conversationStatus}
											</span>
										</p>
									</div>
									<div className="bg-background rounded-lg p-3">
										<p className="text-xs text-muted-foreground mb-1">Ventana 24h</p>
										<p className="text-xs font-medium text-foreground">
											{selectedConversation.lastResponseDate ? "Activa" : "Cerrada"}
										</p>
									</div>
								</section>
							</section>

							{/* Chat/Messages */}

						</>
					) : (
						<div className="flex-1 flex items-center justify-center text-muted-foreground">
							<p>Selecciona una conversación</p>
						</div>
					)}
				</div>
			</section>

			{/* Bottom - Global metrics */}
			<div className="border-t border-border bg-card">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<GlobalMetrics metrics={globalMetrics} />
				</div>
			</div>
		</article >
	)
}
