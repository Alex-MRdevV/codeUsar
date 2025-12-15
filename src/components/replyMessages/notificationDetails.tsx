import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { X, Phone, MessageCircle, Clock, User, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { NotificationUsar } from '@/utils/types/chats';

interface NotificationDetailProps {
	notification: NotificationUsar;
	onClose: () => void;
}

export const NotificationDetail = ({ notification, onClose }: NotificationDetailProps) => {
	const formattedDate = notification.timestamp
		? format(new Date(notification.timestamp), "PPpp", { locale: es })
		: "";

	return (
		<div className="h-full flex flex-col bg-card rounded-xl border border-border shadow-soft overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
						<User className="w-5 h-5 text-primary-foreground" />
					</div>
					<div>
						<h3 className="font-display font-semibold text-foreground">
							{notification.contactName || "Desconocido"}
						</h3>
						<p className="text-sm text-muted-foreground">
							{notification.phone}
						</p>
					</div>
				</div>

				<Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted">
					<X className="w-5 h-5" />
				</Button>
			</div>

			{/* Content */}
			<ScrollArea className="flex-1 p-4 h-[400px]">
				<div className="space-y-6">
					{/* Message */}
					{notification.content && (
						<div className="space-y-2">
							<label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
								<MessageCircle className="w-3.5 h-3.5" />
								Mensaje
							</label>
							<div className="p-4 rounded-lg bg-whatsapp-light border border-primary/10">
								<p className="text-foreground whitespace-pre-wrap">{notification.content}</p>
							</div>
						</div>
					)}

					{/* Details Grid */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
								<Phone className="w-3.5 h-3.5" />
								Teléfono
							</label>
							<p className="text-sm font-mono text-foreground">{notification.phone}</p>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
								<Clock className="w-3.5 h-3.5" />
								Fecha
							</label>
							<p className="text-sm text-foreground">{formattedDate}</p>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
								Tipo
							</label>
							<p className="text-sm text-foreground capitalize">{notification.messageType}</p>
						</div>

						<div className="space-y-1">
							<label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
								Message ID
							</label>
							<p className="text-xs font-mono text-muted-foreground break-all">
								{notification.whatsappMessageId || "N/A"}
							</p>
						</div>
					</div>

					{/* Metadata */}
					<div className="space-y-2">
						<label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
							<FileJson className="w-3.5 h-3.5" />
							Metadata
						</label>
						<pre className="p-4 rounded-lg bg-muted/50 border border-border text-xs font-mono text-foreground whitespace-pre-wrap break-all">
							{JSON.stringify(notification.metadata ?? {}, null, 2)}
						</pre>
					</div>
				</div>
				<ScrollBar orientation="vertical" />
			</ScrollArea>
		</div>
	);
}
