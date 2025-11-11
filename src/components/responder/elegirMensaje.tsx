import { Card } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"

export const EligirMensaje = () => {
	return (
		<article className="lg:col-span-2">
			<Card className="bg-card border-border p-12 flex items-center justify-center h-96">
				<div className="text-center">
					<MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
					<p className="text-muted-foreground">Selecciona un mensaje para responder</p>
				</div>
			</Card>
		</article>
	)
}
