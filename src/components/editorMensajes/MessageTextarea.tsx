interface MessageTextareaProps {
	message: string;
	onMessageChange: (message: string) => void;
	variablesEnabled: boolean;
	onToggleVariables: () => void;
}

export default function MessageTextarea({
	message,
	onMessageChange,
	variablesEnabled,
	onToggleVariables,
}: MessageTextareaProps) {
	return (
		<article className="bg-card border border-border rounded-xl p-6">
			<section className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-semibold">Mensaje</h2>
				<button
					onClick={onToggleVariables}
					className="text-xs bg-primary/20 text-primary px-2 py-1 rounded transition-colors duration-200"
				>
					Variables: {variablesEnabled ? "ON" : "OFF"}
				</button>
			</section>
			<textarea
				value={message}
				onChange={(e) => onMessageChange(e.target.value)}
				placeholder="Escribe tu mensaje aquí... Usa {nombre}, {email}, {fecha} para variables personalizadas"
				className="w-full h-48 bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none sm:h-32"
			/>
			<div className="mt-4 flex items-center justify-between">
				<p className="text-sm text-muted-foreground">{message.length} / 1000 caracteres</p>
				<button className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200">
					👁️ Previsualizar
				</button>
			</div>
		</article>
	);
}
