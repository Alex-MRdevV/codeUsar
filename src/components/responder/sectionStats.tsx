import { Card } from "@/components/ui/card"
import type { MessageReplicar } from "@/utils/types/message"

interface Props {
	messages: MessageReplicar[]
	unrepliedCount: number
}

export const SectionStats = ({ messages, unrepliedCount }: Props) => {
	return (
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
	)
}
