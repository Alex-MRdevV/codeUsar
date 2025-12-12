import { ConversationDetail } from "@/components/replyMessages/chats/conversationDetails"
import type { MetricsByUserProps } from "@/utils/types/chats"

export const MetricsByUser = ({ selectedConversation, handleSendReply }: MetricsByUserProps) => {
	return (
		<article className="hidden md:flex md:flex-1 flex-col overflow-hidden">
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
					<ConversationDetail conversation={selectedConversation} onSendReply={handleSendReply} />
				</>
			) : (
				<div className="flex-1 flex items-center justify-center text-muted-foreground">
					<p>Selecciona una conversación</p>
				</div>
			)}
		</article>
	)
}
