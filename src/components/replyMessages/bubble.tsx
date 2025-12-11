import { MessageStatusIcon } from '@/components/replyMessages/statusIcon';
import { cn } from '@/lib/utils';
import type { MessageBubbleProps } from '@/utils/types/chats';
import { formatMessageTime } from '@/utils/windowsUtils';
import { Bot } from 'lucide-react';

export function MessageBubble({ message }: MessageBubbleProps) {
	const isOutbound = message.direction === 'outbound';
	const isTemplate = message.messageType === 'template';

	return (
		<div
			className={cn(
				'flex w-full animate-fade-in',
				isOutbound ? 'justify-end' : 'justify-start'
			)}
		>
			<div
				className={cn(
					'max-w-[75%] md:max-w-[65%] rounded-2xl px-4 py-2.5 relative',
					isOutbound
						? 'bg-bubble-outbound text-bubble-outbound-foreground rounded-br-md'
						: 'bg-bubble-inbound text-bubble-inbound-foreground rounded-bl-md'
				)}
			>
				{/* Template badge */}
				{isTemplate && (
					<div className="flex items-center gap-1 text-xs opacity-70 mb-1">
						<Bot className="h-3 w-3" />
						<span>Plantilla</span>
					</div>
				)}

				{/* Content */}
				<p className="text-sm whitespace-pre-wrap wrap-break-word leading-relaxed">
					{message.content}
				</p>

				{/* Footer */}
				<div className={cn(
					'flex items-center gap-1.5 mt-1',
					isOutbound ? 'justify-end' : 'justify-start'
				)}>
					<span className="text-[10px] opacity-60">
						{formatMessageTime(message.timestamp)}
					</span>
					{isOutbound && <MessageStatusIcon status={message.status} />}
				</div>
			</div>
		</div>
	);
}
