import type { MessageInputProps } from "@/utils/types/editorMessages";

export const MessageInput = ({ message, onMessageChange }: MessageInputProps) => {
	return (
		<div>
			<label className="text-sm font-semibold text-foreground mb-3 block">Mensaje</label>
			<textarea
				value={message}
				onChange={(e) => onMessageChange(e.target.value)}
				maxLength={700}
				placeholder="Escribe tu mensaje aquí..."
				className="w-full h-40 bg-input border-border text-foreground placeholder-muted-foreground rounded-lg p-4"
			/>
			<p className="text-xs text-muted-foreground mt-2">{message.length}/700 caracteres</p>
		</div>
	);
};
