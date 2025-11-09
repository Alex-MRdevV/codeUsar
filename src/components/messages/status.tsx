import type { MessageStatusBadgeProps } from "@/utils/types/providers/webhooks"
import { AlertCircle, Check, CheckCheck, Clock, Phone, Locate as Update } from "lucide-react"

export const MessageStatusBadge = ({ status }: MessageStatusBadgeProps) => {
	const statusConfig = {
		pending: {
			icon: Clock,
			label: "Pendiente",
			color: "text-yellow-600 dark:text-yellow-400",
			bg: "bg-yellow-50 dark:bg-yellow-900/30",
		},
		sent: {
			icon: Check,
			label: "Enviado",
			color: "text-blue-600 dark:text-blue-400",
			bg: "bg-blue-50 dark:bg-blue-900/30",
		},
		delivered: {
			icon: Check,
			label: "Entregado",
			color: "text-green-600 dark:text-green-400",
			bg: "bg-green-50 dark:bg-green-900/30",
		},
		read: {
			icon: CheckCheck,
			label: "Leído",
			color: "text-emerald-600 dark:text-emerald-400",
			bg: "bg-emerald-50 dark:bg-emerald-900/30",
		},
		failed: {
			icon: AlertCircle,
			label: "Error",
			color: "text-red-600 dark:text-red-400",
			bg: "bg-red-50 dark:bg-red-900/30",
		},
		customer_action: {
			icon: Phone,
			label: "Cliente respondió",
			color: "text-purple-600 dark:text-purple-400",
			bg: "bg-purple-50 dark:bg-purple-900/30",
		},
		customer_updated: {
			icon: Update,
			label: "Teléfono actualizado",
			color: "text-cyan-600 dark:text-cyan-400",
			bg: "bg-cyan-50 dark:bg-cyan-900/30",
		},
		price_info: {
			icon: AlertCircle,
			label: "Información de precio",
			color: "text-orange-600 dark:text-orange-400",
			bg: "bg-orange-50 dark:bg-orange-900/30",
		},
	}

	const config = statusConfig[status]
	const Icon = config.icon

	return (
		<article className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${config.bg}`}>
			<Icon className={`w-4 h-4 ${config.color}`} />
			<span className={`font-medium ${config.color}`}>{config.label}</span>
		</article>
	)
}
