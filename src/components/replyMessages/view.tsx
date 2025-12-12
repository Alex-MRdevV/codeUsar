import type { NotificationUsar } from '@/utils/types/chats';
import { useRef, useState } from 'react';
import { NotificationCenter } from './notificationCenter';
import { AppHeaderNotifications } from './notificationsHeader';

export const ReplyMessagesView = () => {
	const [showCenter, setShowCenter] = useState(true);

	// Usamos ref para que el header pueda seleccionar una notificación
	const notificationCenterRef = useRef<{
		selectNotification: (n: NotificationUsar) => void;
	}>(null);

	return (
		<div className="min-h-screen bg-background flex flex-col">
			<AppHeaderNotifications
				onViewAllNotifications={() => setShowCenter(true)}
				onSelectNotification={(notification) => {
					setShowCenter(true);
					notificationCenterRef.current?.selectNotification(notification);
				}}
			/>

			{/* Main Content */}
			<main className="flex-1 p-4 lg:p-8">
				<div className="max-w-6xl mx-auto">

					{/* Section Header */}
					<div className="mb-6">
						<h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
							Centro de Notificaciones
						</h1>
						<p className="text-muted-foreground mt-1">
							Recibe y visualiza notificaciones de WhatsApp en tiempo real
						</p>
					</div>

					{/* Notification Center */}
					<div className="h-[calc(100vh-220px)]">
						<NotificationCenter ref={notificationCenterRef} />
					</div>

				</div>
			</main>
		</div>
	)
};
