import { cn } from '@/lib/utils';
import type { ConversationStatus, StatusBadgeProps } from '@/utils/types/chats';

const statusConfig: Record<ConversationStatus, { label: string; className: string }> = {
	new: {
		label: 'Nuevo',
		className: 'bg-status-new/15 text-info border-status-new/30',
	},
	contacted: {
		label: 'Contactado',
		className: 'bg-warning/15 text-warning border-warning/30',
	},
	active: {
		label: 'Activo',
		className: 'bg-success/15 text-success border-success/30',
	},
	inactive: {
		label: 'Inactivo',
		className: 'bg-muted text-muted-foreground border-border',
	},
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
	const config = statusConfig[status];

	return (
		<span
			className={cn(
				'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border',
				config.className,
				className
			)}
		>
			{config.label}
		</span>
	);
}
