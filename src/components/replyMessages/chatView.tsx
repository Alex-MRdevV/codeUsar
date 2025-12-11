import { MessageBubble } from '@/components/replyMessages/bubble';
import { StatusBadge } from '@/components/replyMessages/status';
import { WindowIndicator } from '@/components/replyMessages/windowsIndicator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from "@/hooks/common/use-mobile";
import { cn } from '@/lib/utils';
import type { ChatViewProps, Message } from '@/utils/types/chats';
import { formatDate, getWindowStatus } from '@/utils/windowsUtils';
import { ArrowLeft, Info, MoreVertical, Phone, Send, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function ChatView({ client, messages, onSendMessage, onBack }: ChatViewProps) {
	const [inputValue, setInputValue] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const isMobile = useIsMobile();

	const windowStatus = client ? getWindowStatus(client.lastResponseDate) : null;
	const canSendFreeMessage = windowStatus?.isActive ?? false;

	// Auto-scroll to bottom
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	// Group messages by date
	const groupedMessages = messages.reduce((groups, message) => {
		const date = formatDate(message.timestamp);
		if (!groups[date]) {
			groups[date] = [];
		}
		groups[date].push(message);
		return groups;
	}, {} as Record<string, Message[]>);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputValue.trim() || !client) return;
		onSendMessage(inputValue.trim());
		setInputValue('');
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	if (!client) {
		return (
			<div className="flex-1 flex items-center justify-center bg-background">
				<div className="text-center text-muted-foreground">
					<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
						<Send className="h-8 w-8 opacity-50" />
					</div>
					<h2 className="text-lg font-medium mb-1">Selecciona una conversación</h2>
					<p className="text-sm">Elige un chat de la lista para comenzar</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 flex flex-col h-full bg-background">
			{/* Header */}
			<header className="flex items-center gap-3 p-3 md:p-4 border-b border-border bg-card">
				{isMobile && (
					<Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
						<ArrowLeft className="h-5 w-5" />
					</Button>
				)}

				<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
					<User className="h-5 w-5 text-primary" />
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2">
						<h2 className="font-semibold text-foreground truncate">
							{client.name || client.phoneNumber}
						</h2>
						<StatusBadge status={client.conversationStatus} />
					</div>
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<Phone className="h-3 w-3" />
						<span>{client.phoneNumber}</span>
						<span className="text-border">•</span>
						{windowStatus && <WindowIndicator windowStatus={windowStatus} />}
					</div>
				</div>

				<Button variant="ghost" size="icon" className="shrink-0">
					<MoreVertical className="h-5 w-5" />
				</Button>
			</header>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
				{Object.entries(groupedMessages).map(([date, dateMessages]) => (
					<div key={date}>
						{/* Date separator */}
						<div className="flex items-center justify-center my-4">
							<span className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded-full">
								{date}
							</span>
						</div>

						{/* Messages for this date */}
						<div className="space-y-2">
							{dateMessages.map((message) => (
								<MessageBubble key={message.id} message={message} />
							))}
						</div>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>

			{/* Input */}
			<div className="p-3 md:p-4 border-t border-border bg-card">
				{!canSendFreeMessage && (
					<div className="flex items-center gap-2 p-2 mb-3 bg-warning/10 text-warning rounded-lg text-xs">
						<Info className="h-4 w-4 shrink-0" />
						<span>
							La ventana de 24 horas ha expirado. Solo puedes enviar mensajes de plantilla.
						</span>
					</div>
				)}

				<form onSubmit={handleSubmit} className="flex items-end gap-2">
					<Textarea
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder={canSendFreeMessage ? 'Escribe un mensaje...' : 'Usa una plantilla...'}
						disabled={!canSendFreeMessage}
						className={cn(
							'flex-1 min-h-11 max-h-32 resize-none',
							!canSendFreeMessage && 'opacity-50 cursor-not-allowed'
						)}
						rows={1}
					/>
					<Button
						type="submit"
						size="icon"
						disabled={!inputValue.trim() || !canSendFreeMessage}
						className="h-11 w-11 rounded-full shrink-0"
					>
						<Send className="h-5 w-5" />
					</Button>
				</form>
			</div>
		</div>
	);
}
