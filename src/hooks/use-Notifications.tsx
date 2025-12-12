import { notificationEmitter } from '@/hooks/notificationEmitier';
import { getRecentNotifications } from '@/utils/services/historyNumbers/allNotifications';
import { markReadNotification } from '@/utils/services/historyNumbers/markRead';
import type { NotificationUsar } from '@/utils/types/chats';
import { useEffect, useState } from 'react';
import { Realtime } from 'ably';

export const useNotifications = () => {
	const [notifications, setNotifications] = useState<NotificationUsar[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [ably, setAbly] = useState<Realtime | null>(null);

	// Inicializar Ably
	useEffect(() => {
		const ablyClient = new Realtime({
			key: import.meta.env.ACCESS_TOKEN_ABLY
		});

		setAbly(ablyClient);

		return () => {
			ablyClient.close();
		};
	}, []);

	// Fetch initial notifications
	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const [err, data] = await getRecentNotifications();
				if (data) {
					setNotifications(data);
				}
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "Error fetching notifications"
				);
			} finally {
				setLoading(false);
			}
		};

		fetchNotifications();
	}, []);

	// Subscribe a canal de Ably para notificaciones en tiempo real
	useEffect(() => {
		if (!ably) return;

		const channel = ably.channels.get('notifications');

		const handleNewNotification = (message: any) => {
			const newNotification = message.data;

			setNotifications((prev) => {
				// Evitar duplicados
				const exists = prev.some((n) => n.id === newNotification.id);
				if (exists) return prev;

				const updated = [newNotification, ...prev];
				return updated.slice(0, 10);
			});
		};

		// Suscribirse al canal
		channel.subscribe('new-notification', handleNewNotification);

		// Cleanup
		return () => {
			channel.unsubscribe('new-notification', handleNewNotification);
		};
	}, [ably]);

	// Marcar como leído
	const markAsRead = async (id: string) => {
		try {
			await markReadNotification(id);

			// Actualizar estado local
			setNotifications((prev) =>
				prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
			);
		} catch (err) {
			console.error('Error marking notification as read:', err);
		}
	};

	// Marcar todas como leídas
	const markAllAsRead = async () => {
		try {
			const unreadIds = notifications
				.filter((n) => !n.isRead)
				.map((n) => n.id);

			for (const id of unreadIds) {
				await markReadNotification(id);
			}

			setNotifications((prev) =>
				prev.map((n) => ({ ...n, isRead: true }))
			);
		} catch (err) {
			console.error('Error marking all as read:', err);
		}
	};

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	return {
		notifications,
		loading,
		error,
		markAsRead,
		markAllAsRead,
		unreadCount,
	};
};
