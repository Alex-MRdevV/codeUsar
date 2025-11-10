import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { MessageReplicar } from "@/utils/types/message"
import { Clock, MessageCircle, Send, User } from "lucide-react"
import { useState } from "react"

export function MessageReplies() {
	const [messages, setMessages] = useState<MessageReplicar[]>([])
	const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
	const [replyText, setReplyText] = useState("")

	const handleSendReply = (messageId: string) => {
		if (!replyText.trim()) return

		setMessages(
			messages.map((msg) =>
				msg.id === messageId
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
	}

	const selectedMsg = messages.find((m) => m.id === selectedMessage)
	const unrepliedCount = messages.filter((m) => !m.hasReply).length

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-foreground mb-2">Responder Mensajes</h1>
				<p className="text-muted-foreground">Gestiona y responde a los mensajes de tus clientes</p>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card className="bg-card border-border p-4">
					<div className="text-sm text-muted-foreground mb-1">Total de Mensajes</div>
					<div className="text-3xl font-bold text-foreground">{messages.length}</div>
				</Card>
				<Card className="border-border p-4 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
					<div className="text-sm text-muted-foreground mb-1">Sin Responder</div>
					<div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{unrepliedCount}</div>
				</Card>
				<Card className="p-4 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
					<div className="text-sm text-muted-foreground mb-1">Respondidos</div>
					<div className="text-3xl font-bold text-green-600 dark:text-green-400">
						{messages.length - unrepliedCount}
					</div>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Messages List */}
				<div className="lg:col-span-1 space-y-3">
					<h2 className="text-lg font-semibold text-foreground mb-4">Mensajes</h2>
					{messages.map((msg) => (
						<Card
							key={msg.id}
							onClick={() => setSelectedMessage(msg.id)}
							className={cn(
								"bg-card border-border p-4 cursor-pointer transition-all hover:border-primary/50",
								selectedMessage === msg.id && "border-primary/50 bg-primary/5",
								!msg.hasReply && "border-orange-200 dark:border-orange-800",
							)}
						>
							<div className="flex items-start justify-between gap-2 mb-2">
								<div className="font-semibold text-foreground text-sm truncate">{msg.from}</div>
								{!msg.hasReply && (
									<Badge className="bg-orange-600 text-white dark:bg-orange-700 text-xs shrink-0">Nuevo</Badge>
								)}
								{msg.hasReply && (
									<Badge className="bg-green-600 text-white dark:bg-green-700 text-xs shrink-0">Respondido</Badge>
								)}
							</div>
							<p className="text-xs text-muted-foreground mb-2 truncate">{msg.fromPhone}</p>
							<p className="text-sm text-foreground line-clamp-2 mb-3">{msg.message}</p>
							<div className="flex items-center gap-1 text-xs text-muted-foreground">
								<Clock className="w-3 h-3" />
								{msg.timestamp.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
							</div>
						</Card>
					))}
				</div>

				{/* Message Detail and Reply */}
				<div className="lg:col-span-2">
					{selectedMsg ? (
						<div className="space-y-4">
							{/* Customer Message */}
							<Card className="bg-card border-border p-6">
								<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
									<User className="w-5 h-5" />
									Mensaje del Cliente
								</h3>

								<div className="bg-muted/30 p-4 rounded-lg mb-4">
									<div className="flex items-center justify-between mb-3">
										<div>
											<div className="font-semibold text-foreground">{selectedMsg.from}</div>
											<div className="text-sm text-muted-foreground font-mono">{selectedMsg.fromPhone}</div>
										</div>
										<div className="text-xs text-muted-foreground">{selectedMsg.timestamp.toLocaleString("es-ES")}</div>
									</div>
									<p className="text-foreground text-sm leading-relaxed">{selectedMsg.message}</p>
								</div>
							</Card>

							{/* Reply Section */}
							{selectedMsg.hasReply && selectedMsg.replyMessage ? (
								<Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 p-6">
									<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
										<MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
										Tu Respuesta
									</h3>

									<div className="bg-background p-4 rounded-lg mb-4 border border-green-200 dark:border-green-800">
										<p className="text-foreground text-sm leading-relaxed mb-3">{selectedMsg.replyMessage}</p>
										{selectedMsg.replyTime && (
											<div className="text-xs text-muted-foreground">
												Respondido: {selectedMsg.replyTime.toLocaleString("es-ES")}
											</div>
										)}
									</div>
								</Card>
							) : (
								<Card className="bg-card border-border p-6">
									<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
										<MessageCircle className="w-5 h-5" />
										Escribir Respuesta
									</h3>

									<div className="space-y-3">
										<Textarea
											value={replyText}
											onChange={(e) => setReplyText(e.target.value)}
											placeholder="Escribe tu respuesta aquí..."
											className="w-full min-h-32 bg-input border-border text-foreground placeholder-muted-foreground rounded-lg p-4 resize-none"
										/>

										<div className="flex justify-end gap-2">
											<Button
												variant="outline"
												onClick={() => {
													setSelectedMessage(null)
													setReplyText("")
												}}
											>
												Cancelar
											</Button>
											<Button
												onClick={() => handleSendReply(selectedMsg.id)}
												disabled={!replyText.trim()}
												className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
											>
												<Send className="w-4 h-4" />
												Enviar Respuesta
											</Button>
										</div>
									</div>
								</Card>
							)}
						</div>
					) : (
						<Card className="bg-card border-border p-12 flex items-center justify-center h-96">
							<div className="text-center">
								<MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
								<p className="text-muted-foreground">Selecciona un mensaje para responder</p>
							</div>
						</Card>
					)}
				</div>
			</div>
		</div>
	)
}
