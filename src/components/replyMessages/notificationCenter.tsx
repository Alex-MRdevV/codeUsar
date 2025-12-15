import { NotificationDetail } from '@/components/replyMessages/notificationDetails';
import { NotificationItem } from '@/components/replyMessages/notificationItems';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotifications } from '@/hooks/use-Notifications';
import type { NotificationUsar } from '@/utils/types/chats';
import { Bell, Inbox } from 'lucide-react';
import { forwardRef, useImperativeHandle, useState } from 'react';

export const NotificationCenter = forwardRef((_, ref) => {
	const { notifications, loading, error, markAsRead, unreadCount } = useNotifications();
	const [selectedNotification, setSelectedNotification] = useState<NotificationUsar | null>(null);

	// 🌟 Expone el método selectNotification al padre
	useImperativeHandle(ref, () => ({
		selectNotification(notification: NotificationUsar) {
			handleSelect(notification);

			// Opcional: hacer scroll automático a la notificación seleccionada
			const el = document.getElementById(`notif-${notification.id}`);
			if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}));

	const handleSelect = (notification: NotificationUsar) => {
		setSelectedNotification(notification);
		if (!notification.isRead) {
			markAsRead(notification.id);
		}
	};

	return (
		<article className="h-full flex flex-col lg:flex-row gap-4">
			{/* Notifications List */}
			<section className="w-full lg:w-96 flex flex-col bg-card rounded-xl border border-border shadow-soft overflow-hidden">

				{/* Header */}
				<article className="flex items-center justify-between p-4 border-b border-border bg-secondary/30">
					<div className="flex items-center gap-3">
						<div className="relative">
							<Bell className="w-5 h-5 text-primary" />
							{unreadCount > 0 && (
								<span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
									{unreadCount}
								</span>
							)}
						</div>
						<h2 className="font-display font-semibold text-foreground">Notificaciones</h2>
					</div>

					<span className="text-xs text-muted-foreground">Tiempo "real" activo</span>
				</article>

				{/* List */}
				<ScrollArea className="flex-1 h-[400px]">
					<div className="p-2 space-y-2">
						{loading ? (
							Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="p-4 space-y-3">
									<div className="flex items-center gap-3">
										<Skeleton className="w-10 h-10 rounded-full" />
										<div className="flex-1 space-y-2">
											<Skeleton className="h-4 w-2/3" />
											<Skeleton className="h-3 w-full" />
										</div>
									</div>
								</div>
							))
						) : error ? (
							<div className="p-8 text-center text-muted-foreground">
								<p className="text-sm">{error}</p>
							</div>
						) : notifications.length === 0 ? (
							<div className="p-8 text-center">
								<Inbox className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
								<p className="text-sm text-muted-foreground">No hay notificaciones</p>
								<p className="text-xs text-muted-foreground mt-1">
									Las nuevas aparecerán aquí
								</p>
							</div>
						) : (
							notifications.map((notification) => (
								<div id={`notif-${notification.id}`} key={notification.id}>
									<NotificationItem
										notification={notification}
										isSelected={selectedNotification?.id === notification.id}
										onClick={() => handleSelect(notification)}
									/>
								</div>
							))
						)}
					</div>
					<ScrollBar orientation="vertical" />
				</ScrollArea>
			</section>

			{/* Detail Panel */}
			<section className="flex-1 min-h-[400px] lg:min-h-0">
				{selectedNotification ? (
					<NotificationDetail
						notification={selectedNotification}
						onClose={() => setSelectedNotification(null)}
					/>
				) : (
					<section className="h-full flex items-center justify-center bg-card rounded-xl border border-border shadow-soft">
						<div className="text-center p-8">
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
								<MessageCircleIcon className="w-8 h-8 text-muted-foreground" />
							</div>
							<h3 className="font-display font-medium text-foreground mb-1">
								Selecciona una notificación
							</h3>
							<p className="text-sm text-muted-foreground">
								Haz clic en una notificación para ver su contenido completo
							</p>
						</div>
					</section>
				)}
			</section>
		</article>
	);
});

function MessageCircleIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
		</svg>
	);
}
