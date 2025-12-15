import { getRecentNotifications } from '@/utils/services/historyNumbers/allNotifications';
import { markReadNotification } from '@/utils/services/historyNumbers/markRead';
import type { NotificationUsar } from '@/utils/types/chats';
import { Realtime, type Message } from 'ably';
import { useEffect, useRef, useState } from 'react';

export const useNotifications = () => {
	const [notifications, setNotifications] = useState<NotificationUsar[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const ablyRef = useRef<Realtime | null>(null);

	// Inicializar Ably (solo una vez)
	useEffect(() => {
		const ablyClient = new Realtime({
			authUrl: "/api/hooks/authAbly",
			clientId: "SendFlow",
		});

		ablyRef.current = ablyClient;

		return () => {
			ablyClient.close();
		};
	}, []);

	// Fetch inicial
	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const [err, data] = await getRecentNotifications();
				if (data) {
					setNotifications(data);
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Error fetching notifications"
				);
			} finally {
				setLoading(false);
			}
		};

		fetchNotifications();
	}, []);

	// Suscripción a actualizaciones de estado
	useEffect(() => {
		const ably = ablyRef.current;
		if (!ably) return;

		const channel = ably.channels.get("notifications");

		const handleStatusUpdate = (message: Message) => {
			const { whatsappMessageId, status, timestamp } = message.data as {
				whatsappMessageId: string;
				status: "sent" | "delivered" | "read" | "failed";
				timestamp: string;
			};

			setNotifications((prev) =>
				prev.map((n) => {
					// Buscar por whatsappMessageId
					if (n.whatsappMessageId !== whatsappMessageId) return n;

					// Actualizar el estado
					return {
						...n,
						isRead: status === "read" ? true : n.isRead,
						metadata: {
							...n.metadata,
							status,
							...(status === "sent" && { sentAt: timestamp }),
							...(status === "delivered" && { deliveredAt: timestamp }),
							...(status === "read" && { readAt: timestamp }),
							...(status === "failed" && { failedAt: timestamp }),
						},
					};
				})
			);
		};

		channel.subscribe("message-status-update", handleStatusUpdate);

		return () => {
			channel.unsubscribe("message-status-update", handleStatusUpdate);
		};
	}, []);

	// Suscripción a nuevos mensajes
	useEffect(() => {
		const ably = ablyRef.current;
		if (!ably) return;

		const channel = ably.channels.get("notifications");

		const handleNewMessage = (message: Message) => {
			const newNotification = message.data as NotificationUsar;
			console.log("Nuevo mensaje:", newNotification);

			setNotifications((prev) => {
				// Evitar duplicados
				if (prev.some((n) => n.whatsappMessageId === newNotification.whatsappMessageId)) {
					return prev;
				}
				return [newNotification, ...prev].slice(0, 10);
			});
		};

		channel.subscribe("new-message", handleNewMessage);

		return () => {
			channel.unsubscribe("new-message", handleNewMessage);
		};
	}, []);

	// Marcar una como leída manualmente (desde tu UI)
	const markAsRead = async (id: string) => {
		try {
			await markReadNotification(id);
			setNotifications((prev) =>
				prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
			);
		} catch (err) {
			console.error("Error marking as read:", err);
		}
	};

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	return {
		notifications,
		loading,
		error,
		markAsRead,
		unreadCount,
	};
};
