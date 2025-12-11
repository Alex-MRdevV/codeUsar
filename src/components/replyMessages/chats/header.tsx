import type { HeaderReplyMessagesProps } from "@/utils/types/chats"

export const HeaderReplyMessages = ({ globalMetrics }: HeaderReplyMessagesProps) => {
	return (
		<header className="border-b border-border bg-card">
			<section className="max-w-7xl mx-auto px-6 py-4">
				<section className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-foreground">Messages Management</h1>
						<p className="text-sm text-muted-foreground">Gestiona las conversaciones y métricas</p>
					</div>
					<div className="flex items-center gap-2 text-sm">
						<span className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full font-medium">
							{globalMetrics.activeConversations} activos
						</span>
					</div>
				</section>
			</section>
		</header>
	)
}
