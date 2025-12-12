import { cn } from '@/lib/utils';
import type { NotificationItemProps } from '@/utils/types/chats';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageCircle, User } from 'lucide-react';

export function NotificationItem({ notification, isSelected, onClick }: NotificationItemProps) {
	const timeAgo = notification.timestamp
		? formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true, locale: es })
		: "";

	const isMedia =
		notification.messageType === "image" ||
		notification.messageType === "video" ||
		notification.messageType === "audio" ||
		notification.messageType === "document";

	const preview =
		notification.content ||
		(isMedia ? `📎 Mensaje de tipo ${notification.messageType}` : "Nuevo mensaje");

	return (
		<button
			onClick={onClick}
			className={cn(
				"w-full text-left p-4 rounded-lg transition-all duration-200 notification-enter",
				"hover:shadow-soft hover:scale-[1.01] active:scale-[0.99]",
				"border border-transparent",
				isSelected
					? "bg-accent border-primary/20 shadow-glow"
					: notification.isRead
						? "bg-card hover:bg-secondary/50"
						: "bg-whatsapp-light hover:bg-accent"
			)}
		>
			<div className="flex items-start gap-3">
				{/* Avatar */}
				<div
					className={cn(
						"w-10 h-10 rounded-full flex items-center justify-center shrink-0",
						notification.isRead ? "bg-muted" : "bg-primary notification-pulse"
					)}
				>
					<User
						className={cn(
							"w-5 h-5",
							notification.isRead ? "text-muted-foreground" : "text-primary-foreground"
						)}
					/>
				</div>

				{/* Content */}
				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between gap-2">
						<h4
							className={cn(
								"font-display text-sm truncate",
								notification.isRead ? "font-medium text-foreground" : "font-semibold text-foreground"
							)}
						>
							{notification.contactName || notification.phone || "Desconocido"}
						</h4>

						<span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo}</span>
					</div>

					<p
						className={cn(
							"text-sm mt-1 line-clamp-2",
							notification.isRead ? "text-muted-foreground" : "text-foreground/80"
						)}
					>
						{preview}
					</p>

					{/* Status indicators */}
					<div className="flex items-center gap-2 mt-2">
						{!notification.isRead && (
							<span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
								<MessageCircle className="w-3 h-3" />
								Nuevo
							</span>
						)}

						<span className="text-xs text-muted-foreground capitalize">{notification.messageType}</span>
					</div>
				</div>

				{/* Unread dot */}
				{!notification.isRead && <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1" />}
			</div>
		</button>
	);
}
