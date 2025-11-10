import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

interface Props {
	handleSendMessage: () => void
	canSend: () => boolean
	isSubmitting: boolean
	recipients: string[]
}

export const ButtonEnvio = ({ handleSendMessage, canSend, isSubmitting, recipients }: Props) => {
	return (
		<Button
			onClick={handleSendMessage}
			disabled={!canSend()}
			className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-semibold gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
		>
			{isSubmitting ? (
				<>
					<div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
					Enviando...
				</>
			) : (
				<>
					<Send className="w-5 h-5" />
					{recipients.length > 0
						? `Enviar a ${recipients.length} contacto${recipients.length !== 1 ? "s" : ""}`
						: 'Agregar destinatarios'
					}
				</>
			)}
		</Button>
	)
}
