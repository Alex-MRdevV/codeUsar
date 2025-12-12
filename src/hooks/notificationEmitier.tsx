import type { NotificationUsar } from "@/utils/types/chats";

/**
 * EventEmitter simple para notificaciones en tiempo real
 */
class NotificationEmitter {
	private listeners: Set<(notification: NotificationUsar) => void> = new Set();

	subscribe(callback: (notification: NotificationUsar) => void) {
		this.listeners.add(callback);
		return () => {
			this.listeners.delete(callback);
		};
	}

	emit(notification: NotificationUsar) {
		this.listeners.forEach((callback) => callback(notification));
	}

	// Método para debugging
	getListenerCount() {
		return this.listeners.size;
	}
}

export const notificationEmitter = new NotificationEmitter();
