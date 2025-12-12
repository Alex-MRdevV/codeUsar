import { LoadingWrapper } from "@/components/loading/wrapper"
import { ReplyMessagesClientsContainer } from "@/components/replyMessages/chats/container"
import { ConversationsList } from "@/components/replyMessages/chats/conversationList"
import { GlobalMetrics } from "@/components/replyMessages/chats/globalMetrics"
import { HeaderReplyMessages } from "@/components/replyMessages/chats/header"
import { MetricsByUser } from "@/components/replyMessages/chats/metricsForUser"
import { getAllConversationsChats } from "@/utils/services/historyNumbers/allConversations"
import type { Conversation } from "@/utils/types/chats"
import { useEffect, useState } from "react"

export const ReplyMessagesClients = () => {
	const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
	const [conversations, setConversations] = useState<Conversation[] | null>([])

	useEffect(() => {
		let mounted = true;
		getAllConversationsChats().then(([err, conversationsChats]) => {
			if (!mounted) return;
			if (!err) {
				setConversations(conversationsChats);
			}
		});
		return () => {
			mounted = false;
		};
	}, []);

	if (!conversations) {
		return <LoadingWrapper isLoading={true} message="Cargando..." />
	}

	const { globalMetrics, handleSendReply } = ReplyMessagesClientsContainer(conversations, setConversations, setSelectedConversation)

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

				<MetricsByUser
					handleSendReply={handleSendReply}
					selectedConversation={selectedConversation}
				/>
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
