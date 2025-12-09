import { X, Phone, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { MessageCardProps } from "@/utils/types/messages";

export const MessageCard = ({ message, onRemove, index }: MessageCardProps) => {
	return (
		<Card className="group relative bg-card border-border shadow-card hover:shadow-card-hover transition-all duration-200 message-card-enter">
			<CardContent className="p-4">
				<article className="flex items-start justify-between gap-3">
					<section className="flex-1 min-w-0 space-y-3">
						{/* Header with number badge */}
						<section className="flex items-center gap-2">
							<span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
								{index + 1}
							</span>
							<div className="flex items-center gap-1.5 text-sm text-muted-foreground">
								<User className="w-3.5 h-3.5" />
								<span className="font-medium text-foreground">{message.name}</span>
							</div>
						</section>

						{/* Phone */}
						<div className="flex items-center gap-1.5 text-sm">
							<Phone className="w-3.5 h-3.5 text-primary" />
							<span className="font-mono text-foreground">{message.phone}</span>
						</div>

						{/* Message content */}
						<div className="flex items-start gap-1.5">
							<MessageSquare className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
							<p className="text-sm text-foreground leading-relaxed wrap-break-word">
								{message.content}
							</p>
						</div>
					</section>

					{/* Remove button */}
					<Button
						variant="ghost"
						size="icon"
						onClick={() => onRemove(message.id)}
						className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
						title="Quitar mensaje"
					>
						<X className="w-4 h-4" />
					</Button>
				</article>
			</CardContent>
		</Card>
	);
};
