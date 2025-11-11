import { ConfigurarSend } from "@/components/responder/configurarEnvio"
import { MensajeDetalle } from "@/components/responder/detalleMensaje"
import { EligirMensaje } from "@/components/responder/elegirMensaje"
import { MensajesListas } from "@/components/responder/mensajesList"
import { SectionStats } from "@/components/responder/sectionStats"
import { sendWhatsAppMessage } from "@/lib/providersMensajes/callApi/useApiSendResponse"
import type { MessageReplicar } from "@/utils/types/message"
import type { ReplyMessageRequest } from "@/utils/types/providers/meta"
import { useState } from "react"

export function MessageReplies() {
	const [messages, setMessages] = useState<MessageReplicar[]>([])
	const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
	const [replyText, setReplyText] = useState("")
	const { createHandler, isSubmitting, resultados } = ConfigurarSend()

	const selectedMsg = messages.find((m) => m.id === selectedMessage)
	const unrepliedCount = messages.filter((m) => !m.hasReply).length

	const handleSendReply = createHandler(async () => {
		if (!replyText.trim() || !selectedMsg) return [new Error("Datos inválidos"), null]

		const requestData: ReplyMessageRequest = {
			messageType: "text",
			replyToMessageId: selectedMsg.id,
			content: replyText,
		}

		const [error, response] = await sendWhatsAppMessage(requestData)

		if (error) {
			return [error, null]
		}

		setMessages(
			messages.map((msg) =>
				msg.id === selectedMessage
					? {
						...msg,
						hasReply: true,
						replyMessage: replyText,
						replyTime: new Date(),
					}
					: msg,
			),
		)

		setReplyText("")
		setSelectedMessage(null)

		return [null, response]
	})

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-foreground mb-2">Responder Mensajes</h1>
				<p className="text-muted-foreground">Gestiona y responde a los mensajes de tus clientes</p>
			</div>

			{/* Stats */}
			<SectionStats messages={messages} unrepliedCount={unrepliedCount} />

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Messages List */}
				<MensajesListas
					messages={messages}
					selectedMessage={selectedMessage}
					setSelectedMessage={setSelectedMessage}
				/>

				{/* Message Detail and Reply */}
				{
					selectedMsg ? (
						<MensajeDetalle
							selectedMsg={selectedMsg}
							handleSendReply={() => handleSendReply()} // ✅ Envolver
							setSelectedMessage={setSelectedMessage}
							setReplyText={setReplyText}
							replyText={replyText}
							isSubmitting={isSubmitting}
						/>
					) : <EligirMensaje />
				}
			</div>
		</div>
	)
}
