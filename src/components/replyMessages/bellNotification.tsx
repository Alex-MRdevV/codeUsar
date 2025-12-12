import { NotificationItem } from '@/components/replyMessages/notificationItems';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/use-Notifications';
import { cn } from '@/lib/utils';
import type { NotificationBellProps, NotificationUsar } from '@/utils/types/chats';
import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const NotificationBell = ({ onViewAll, onSelectNotification }: NotificationBellProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { notifications, unreadCount, markAsRead } = useNotifications();

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSelect = (notification: NotificationUsar) => {
		if (!notification.isRead) {
			markAsRead(notification.id);
		}
		onSelectNotification?.(notification);
		setIsOpen(false);
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<Button
				variant="ghost"
				size="icon"
				className={cn(
					'relative w-10 h-10 rounded-full hover:bg-secondary transition-colors',
					isOpen && 'bg-secondary'
				)}
				onClick={() => setIsOpen(!isOpen)}
			>
				<Bell className="w-5 h-5 text-foreground" />
				{unreadCount > 0 && (
					<span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center notification-pulse">
						{unreadCount > 9 ? '9+' : unreadCount}
					</span>
				)}
			</Button>

			{/* Dropdown */}
			{isOpen && (
				<div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card rounded-xl border border-border shadow-soft z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
					{/* Header */}
					<div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30">
						<h3 className="font-display font-semibold text-foreground">Notificaciones</h3>
						{unreadCount > 0 && (
							<span className="text-xs text-primary font-medium">
								{unreadCount} sin leer
							</span>
						)}
					</div>

					{/* Notification List */}
					<ScrollArea className="max-h-[400px]">
						{notifications.length === 0 ? (
							<div className="p-8 text-center">
								<Bell className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
								<p className="text-sm text-muted-foreground">No hay notificaciones</p>
							</div>
						) : (
							<div className="p-2 space-y-1">
								{notifications.map((notification) => (
									<NotificationItem
										key={notification.id}
										notification={notification}
										isSelected={false}
										onClick={() => handleSelect(notification)}
									/>
								))}
							</div>
						)}
					</ScrollArea>

					{/* Footer */}
					{notifications.length > 0 && (
						<div className="p-2 border-t border-border bg-secondary/20">
							<Button
								variant="ghost"
								className="w-full text-primary hover:text-primary hover:bg-primary/10 font-medium"
								onClick={() => {
									onViewAll?.();
									setIsOpen(false);
								}}
							>
								Ver todas las notificaciones
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
