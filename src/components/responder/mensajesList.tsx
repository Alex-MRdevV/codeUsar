import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { MessageReplicar } from "@/utils/types/message"
import { Clock } from "lucide-react"
import type { SetStateAction } from "react"

interface Props {
	messages: MessageReplicar[]
	setSelectedMessage: (value: SetStateAction<string | null>) => void
	selectedMessage: string | null
}

export const MensajesListas = ({ messages, setSelectedMessage, selectedMessage }: Props) => {
	return (
		<article className="lg:col-span-1 space-y-3">
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
					<section className="flex items-start justify-between gap-2 mb-2">
						<div className="font-semibold text-foreground text-sm truncate">{msg.from}</div>
						{!msg.hasReply && (
							<Badge className="bg-orange-600 text-white dark:bg-orange-700 text-xs shrink-0">Nuevo</Badge>
						)}
						{msg.hasReply && (
							<Badge className="bg-green-600 text-white dark:bg-green-700 text-xs shrink-0">Respondido</Badge>
						)}
					</section>
					<p className="text-xs text-muted-foreground mb-2 truncate">{msg.fromPhone}</p>
					<p className="text-sm text-foreground line-clamp-2 mb-3">{msg.message}</p>
					<div className="flex items-center gap-1 text-xs text-muted-foreground">
						<Clock className="w-3 h-3" />
						{msg.timestamp.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
					</div>
				</Card>
			))}
		</article>
	)
}
