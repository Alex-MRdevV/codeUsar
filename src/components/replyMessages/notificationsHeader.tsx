import type { NotificationUsar } from '@/utils/types/chats';
import { MessageSquare } from 'lucide-react';
import { NotificationBell } from './bellNotification';

interface AppHeaderProps {
	onViewAllNotifications?: () => void;
	onSelectNotification?: (notification: NotificationUsar) => void;
}

export function AppHeaderNotifications({ onViewAllNotifications, onSelectNotification }: AppHeaderProps) {
	return (
		<header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-md">
			<div className="max-w-6xl mx-auto px-4 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
							<MessageSquare className="w-5 h-5 text-primary-foreground" />
						</div>
						<span className="font-display font-semibold text-lg text-foreground hidden sm:block">
							Gestión de mensajes
						</span>
					</div>

					{/* Actions */}
					<div className="flex items-center gap-2">
						<NotificationBell
							onViewAll={onViewAllNotifications}
							onSelectNotification={onSelectNotification}
						/>
					</div>
				</div>
			</div>
		</header>
	);
}
