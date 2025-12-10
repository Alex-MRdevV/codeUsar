import { MessageCard } from "@/components/messages/messagesIndividual/cardMessage";
import type { MessageListProps } from "@/utils/types/messages";
import { Inbox } from "lucide-react";

export const MessageList = ({ messages, onRemove }: MessageListProps) => {
	if (messages.length === 0) {
		return (
			<article className="flex flex-col items-center justify-center py-12 px-4 text-center">
				<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
					<Inbox className="w-8 h-8 text-muted-foreground" />
				</div>
				<h3 className="text-lg font-medium text-foreground mb-1">
					No hay mensajes
				</h3>
				<p className="text-sm text-muted-foreground max-w-xs">
					Agrega mensajes usando el formulario para verlos antes de enviar.
				</p>
			</article>
		);
	}

	return (
		<section className="space-y-3">
			{messages.map((message, index) => (
				<MessageCard
					key={message.id}
					message={message}
					onRemove={onRemove}
					index={index}
				/>
			))}
		</section>
	);
};
