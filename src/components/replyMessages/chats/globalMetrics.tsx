import type { GlobalMetricsProps } from "@/utils/types/chats"
import { AlertCircle, Check, MessageSquare, TrendingUp } from "lucide-react"

export const GlobalMetrics = ({ metrics }: GlobalMetricsProps) => {
	return (
		<article className="grid grid-cols-2 md:grid-cols-6 gap-4">
			<section className="flex items-center gap-3">
				<div className="p-2 bg-blue-500/10 rounded-lg">
					<MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
				</div>
				<div>
					<p className="text-xs text-muted-foreground">Total Mensajes</p>
					<p className="text-lg font-bold text-foreground">{metrics.totalMessages}</p>
				</div>
			</section>

			<section className="flex items-center gap-3">
				<div className="p-2 bg-green-500/10 rounded-lg">
					<TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
				</div>
				<div>
					<p className="text-xs text-muted-foreground">Tasa Lectura</p>
					<p className="text-lg font-bold text-foreground">{metrics.readRate}%</p>
				</div>
			</section>

			<section className="flex items-center gap-3">
				<div className="p-2 bg-purple-500/10 rounded-lg">
					<Check className="h-5 w-5 text-purple-600 dark:text-purple-400" />
				</div>
				<div>
					<p className="text-xs text-muted-foreground">Tasa Respuesta</p>
					<p className="text-lg font-bold text-foreground">{metrics.responseRate}%</p>
				</div>
			</section>

			<section className="flex items-center gap-3">
				<div className="p-2 bg-red-500/10 rounded-lg">
					<AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
				</div>
				<div>
					<p className="text-xs text-muted-foreground">Tasa Fallos</p>
					<p className="text-lg font-bold text-foreground">{metrics.failRate}%</p>
				</div>
			</section>

			<section className="flex items-center gap-3">
				<div className="p-2 bg-amber-500/10 rounded-lg">
					<MessageSquare className="h-5 w-5 text-amber-600 dark:text-amber-400" />
				</div>
				<div>
					<p className="text-xs text-muted-foreground">Conversaciones</p>
					<p className="text-lg font-bold text-foreground">{metrics.totalConversations}</p>
				</div>
			</section>

			<section className="flex items-center gap-3">
				<div className="p-2 bg-cyan-500/10 rounded-lg">
					<TrendingUp className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
				</div>
				<div>
					<p className="text-xs text-muted-foreground">Activas Ahora</p>
					<p className="text-lg font-bold text-foreground">{metrics.activeConversations}</p>
				</div>
			</section>
		</article>
	)
}
