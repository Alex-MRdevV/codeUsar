import { cn } from '@/lib/utils';
import { type WindowIndicatorProps, type WindowStatus } from "@/utils/types/chats";
import { AlertCircle, Clock, XCircle } from 'lucide-react';

export const WindowIndicator = ({ windowStatus, className, showLabel = true }: WindowIndicatorProps) => {
	if (!windowStatus.expiresAt) {
		return (
			<div className={cn('flex items-center gap-1.5 text-muted-foreground', className)}>
				<XCircle className="h-3.5 w-3.5" />
				{showLabel && <span className="text-xs">Sin ventana</span>}
			</div>
		);
	}

	if (!windowStatus.isActive) {
		return (
			<div className={cn('flex items-center gap-1.5 text-window-expired', className)}>
				<XCircle className="h-3.5 w-3.5" />
				{showLabel && <span className="text-xs">Ventana expirada</span>}
			</div>
		);
	}

	if (windowStatus.isExpiring) {
		return (
			<div className={cn('flex items-center gap-1.5 text-window-expiring', className)}>
				<AlertCircle className="h-3.5 w-3.5 animate-pulse-soft" />
				{showLabel && <span className="text-xs">{windowStatus.hoursRemaining}h restantes</span>}
			</div>
		);
	}

	return (
		<div className={cn('flex items-center gap-1.5 text-window-active', className)}>
			<Clock className="h-3.5 w-3.5" />
			{showLabel && <span className="text-xs">{windowStatus.hoursRemaining}h activa</span>}
		</div>
	);
}
