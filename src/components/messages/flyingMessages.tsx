import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import type { FlyingMessage, MessagesFlyingCardsProps } from "@/utils/types/flyingCards"
import { AlertCircle, CheckCircle2, Mail } from "lucide-react"
import { useEffect, useState } from "react"

export const FlyingCard = ({ message, index }: { message: FlyingMessage; index: number }) => {
	const [isVisible, setIsVisible] = useState(true)

	// apenas termine se limpian
	useEffect(() => {
		if (message.status === "sent") {
			const timer = setTimeout(() => {
				setIsVisible(false)
			}, 2000)
			return () => clearTimeout(timer)
		}
	}, [message.status])

	if (!isVisible && message.status === "sent") return null

	const randomRotation = Math.random() * 20 - 10
	const randomDelay = index * 150
	const randomDuration = 2500 + Math.random() * 500
	const randomX = Math.random() * 300 - 150
	const isError = message.status === "error"
	const isSent = message.status === "sent"

	return (
		<article
			className={cn(
				"flying-card",
				"fixed bottom-20 left-1/2 w-72 -translate-x-1/2 pointer-events-none",
				"bg-card border rounded-lg shadow-xl p-4",
				"flex items-start gap-3 z-40",
				{
					"flying-card-error bg-destructive/10": isError,
					"bg-success/10": isSent,
				},
			)}
			style={{
				'--rotation': `${randomRotation}deg`,
				'--rotation-end': `${randomRotation + 45}deg`,
				'--x': `${randomX}px`,
				'--duration': `${randomDuration}ms`,
				'--delay': `${randomDelay}ms`,
				borderColor: isError
					? "hsl(var(--destructive) / 0.3)"
					: isSent
						? "hsl(var(--success) / 0.3)"
						: "var(--border)",
			} as React.CSSProperties}
		>
			{/* Icon */}
			<div className="shrink-0 mt-1">
				{isError ? (
					<AlertCircle className="size-5 text-destructive animate-pulse" />
				) : message.status === "sending" ? (
					<Mail className="size-5 text-primary animate-bounce" />
				) : (
					<CheckCircle2 className="size-5 text-success" />
				)}
			</div>

			{/* Content */}
			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium text-card-foreground truncate">{message.recipient}</p>
				<p className="text-xs text-muted-foreground mt-1">
					{isError ? `Error ${message.errorCode || "desconocido"}` : isSent ? "Entregado" : "Enviando..."}
				</p>
			</div>
		</article>
	)
}

export const MessagesFlyingCards = ({ messages, isActive }: MessagesFlyingCardsProps) => {
	const { open } = useSidebar()

	if (!open) {
		return null
	}

	if (messages.length === 0) {
		return null
	}

	return (
		<div className="fixed inset-0 pointer-events-none z-40">
			{messages.map((message, index) => (
				<FlyingCard key={message.id} message={message} index={index} />
			))}
		</div>
	)
}
