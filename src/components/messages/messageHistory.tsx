import { EventDetails } from "@/components/messages/detalles"
import { MessageStatusBadge } from "@/components/messages/status"
import { Card } from "@/components/ui/card"
import type { MessageHistoryProps, WebhookEvent } from "@/utils/types/providers/webhooks"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export function MessageHistory({ events }: MessageHistoryProps) {
	const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
	const sortedEvents = [...events].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

	const getEventDescription = (event: WebhookEvent) => {
		const baseText = `${event.recipient.name} (${event.recipient.phone})`
		const nameEvent = event.type
		const tiposEventos: Record<string, string> = {
			"customer_action": `${baseText} respondió al mensaje`,
			"customer_updated": `${baseText} actualizó su número de teléfono`,
			"price_info": `Información de precio enviada a ${baseText}`,
			"failed": `Error al enviar a ${baseText}`
		}

		return tiposEventos[nameEvent] || baseText;
	}

	if (events.length === 0) {
		return (
			<Card className="bg-card border-border p-6 text-center">
				<p className="text-muted-foreground">Sin eventos registrados aún</p>
			</Card>
		)
	}

	return (
		<div className="space-y-3">
			{sortedEvents.map((event) => (
				<Card
					key={event.id}
					className="bg-card border-border p-4 hover:border-primary/50 transition-colors cursor-pointer"
					onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
				>
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-2">
								<MessageStatusBadge status={event.type} timestamp={event.timestamp} />
								<span className="text-xs text-muted-foreground">
									{event.timestamp.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
								</span>
							</div>
							<p className="text-sm text-foreground">{getEventDescription(event)}</p>
						</div>
						<ChevronDown
							className={`w-5 h-5 text-muted-foreground transition-transform ${expandedEvent === event.id ? "rotate-180" : ""
								}`}
						/>
					</div>

					{expandedEvent === event.id && (
						<EventDetails
							event={event}
							key={event.id}
						/>
					)}
				</Card>
			))}
		</div>
	)
}
