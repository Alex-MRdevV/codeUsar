import type { Conversation, MessageUsar } from "@/utils/types/chats"
import { useMemo, type SetStateAction, type Dispatch } from "react"

export const ReplyMessagesClientsContainer = (conversations: Conversation[]) => {
	const globalMetrics = useMemo(() => {
		const allMessages = conversations.flatMap((c) => c.messages)
		const deliveredMessages = allMessages.filter((m) => ["delivered", "read"].includes(m.status as string)).length
		const readMessages = allMessages.filter((m) => m.status === "read").length
		const failedMessages = allMessages.filter((m) => m.status === "failed").length
		const respondedConversations = conversations.filter((c) => c.totalMessagesReceived > 0).length
		const sentMessages = conversations.reduce((sum, c) => sum + c.totalMessagesSent, 0)

		return {
			totalConversations: conversations.length,
			activeConversations: conversations.filter((c) => c.conversationStatus === "active").length,
			readRate: deliveredMessages > 0 ? ((readMessages / deliveredMessages) * 100).toFixed(1) : "0",
			responseRate: sentMessages > 0 ? ((respondedConversations / conversations.length) * 100).toFixed(1) : "0",
			failRate: allMessages.length > 0 ? ((failedMessages / allMessages.length) * 100).toFixed(1) : "0",
			totalMessages: allMessages.length,
		}
	}, [conversations])

	return {
		globalMetrics
	}
}
