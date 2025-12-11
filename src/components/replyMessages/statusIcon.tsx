import { cn } from '@/lib/utils';
import type { MessageStatusIconProps } from '@/utils/types/chats';
import { AlertCircle, Check, CheckCheck, Clock } from 'lucide-react';

export function MessageStatusIcon({ status, className }: MessageStatusIconProps) {
	if (!status) return null;

	const iconClass = cn('h-3.5 w-3.5', className);

	switch (status) {
		case 'pending':
			return <Clock className={cn(iconClass, 'text-msg-pending')} />;
		case 'sent':
			return <Check className={cn(iconClass, 'text-msg-sent')} />;
		case 'delivered':
			return <CheckCheck className={cn(iconClass, 'text-msg-delivered')} />;
		case 'read':
			return <CheckCheck className={cn(iconClass, 'text-msg-read')} />;
		case 'failed':
			return <AlertCircle className={cn(iconClass, 'text-msg-failed')} />;
		default:
			return null;
	}
}
