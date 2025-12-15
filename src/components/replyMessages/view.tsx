import { NotificationCenter } from '@/components/replyMessages/notificationCenter';
import type { NotificationUsar } from '@/utils/types/chats';
import { useRef } from 'react';

export const ReplyMessagesView = () => {
	// Usamos ref para que el header pueda seleccionar una notificación
	const notificationCenterRef = useRef<{
		selectNotification: (n: NotificationUsar) => void;
	}>(null);

	return (
		<article className="min-h-screen bg-background flex flex-col">
			{/* Main Content */}
			<main className="flex-1 p-4 lg:p-8">
				<section className="max-w-6xl mx-auto">

					{/* Section Header */}
					<div className="mb-6">
						<h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
							Centro de Notificaciones
						</h1>
						<p className="text-muted-foreground mt-1">
							Recibe y visualiza notificaciones de WhatsApp
						</p>
					</div>

					{/* Notification Center */}
					<div className="h-[calc(100vh-220px)]">
						<NotificationCenter ref={notificationCenterRef} />
					</div>
				</section>
			</main>
		</article>
	)
};
