import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import type { MessageReplicar } from "@/utils/types/message"
import { MessageCircle, Send, User } from "lucide-react"
import type { SetStateAction } from "react"

interface Props {
	selectedMsg: MessageReplicar
	handleSendReply: (data?: any) => Promise<void>
	setSelectedMessage: (value: SetStateAction<string | null>) => void
	setReplyText: (value: SetStateAction<string>) => void
	replyText: string
	isSubmitting: boolean
}

export const MensajeDetalle = ({
	selectedMsg,
	handleSendReply,
	setSelectedMessage,
	setReplyText,
	replyText,
	isSubmitting
}: Props) => {

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault() // ✅ Previene el comportamiento por defecto del formulario

		if (!replyText.trim()) return // ✅ Valida que no esté vacío

		try {
			await handleSendReply() // ✅ Ejecuta la función asíncrona
		} catch (error) {
			console.error("Error al enviar respuesta:", error)
		}
	}

	return (
		<article className="lg:col-span-2">
			<div className="space-y-4">
				{/* Customer Message */}
				<Card className="bg-card border-border p-6">
					<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
						<User className="w-5 h-5" />
						Mensaje del Cliente
					</h3>

					<section className="bg-muted/30 p-4 rounded-lg mb-4">
						<div className="flex items-center justify-between mb-3">
							<div>
								<div className="font-semibold text-foreground">{selectedMsg.from}</div>
								<div className="text-sm text-muted-foreground font-mono">{selectedMsg.fromPhone}</div>
							</div>
							<div className="text-xs text-muted-foreground">{selectedMsg.timestamp.toLocaleString("es-ES")}</div>
						</div>
						<p className="text-foreground text-sm leading-relaxed">{selectedMsg.message}</p>
					</section>
				</Card>

				{/* Reply Section */}
				{selectedMsg.hasReply && selectedMsg.replyMessage ? (
					<Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 p-6">
						<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
							<MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
							Tu Respuesta
						</h3>

						<section className="bg-background p-4 rounded-lg mb-4 border border-green-200 dark:border-green-800">
							<p className="text-foreground text-sm leading-relaxed mb-3">{selectedMsg.replyMessage}</p>
							{selectedMsg.replyTime && (
								<div className="text-xs text-muted-foreground">
									Respondido: {selectedMsg.replyTime.toLocaleString("es-ES")}
								</div>
							)}
						</section>
					</Card>
				) : (
					<Card className="bg-card border-border p-6">
						<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
							<MessageCircle className="w-5 h-5" />
							Escribir Respuesta
						</h3>

						{/* ✅ Envolver en un formulario */}
						<form onSubmit={handleSubmit} className="space-y-3">
							<Textarea
								value={replyText}
								onChange={(e) => setReplyText(e.target.value)}
								placeholder="Escribe tu respuesta aquí..."
								className="w-full min-h-32 bg-input border-border text-foreground placeholder-muted-foreground rounded-lg p-4 resize-none"
								disabled={isSubmitting}
							/>

							<div className="flex justify-end gap-2">
								<Button
									type="button" // ✅ Especificar que no es submit
									variant="outline"
									onClick={() => {
										setSelectedMessage(null)
										setReplyText("")
									}}
									disabled={isSubmitting}
								>
									Cancelar
								</Button>
								<Button
									type="submit" // ✅ Cambiar a tipo submit
									disabled={!replyText.trim() || isSubmitting}
									className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
								>
									{isSubmitting ? (
										<>
											<div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
											Enviando...
										</>
									) : (
										<>
											<Send className="w-4 h-4" />
											Enviar Respuesta
										</>
									)}
								</Button>
							</div>
						</form>
					</Card>
				)}
			</div>
		</article>
	)
}
