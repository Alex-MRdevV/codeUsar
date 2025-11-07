import React from "react";

interface PreviewCardProps {
	message: string;
	recipients: string[];
}

export const PreviewCard: React.FC<PreviewCardProps> = ({ message, recipients }) => {
	return (
		<div className="bg-card border-border p-6 h-fit">
			<h3 className="text-sm font-semibold text-foreground mb-4">Vista Previa</h3>
			<div
				className="bg-muted/30 rounded-lg p-4 min-h-40 max-h-40 overflow-y-auto"
				style={{ wordBreak: "break-word" }} // Asegura que las palabras largas se ajusten
			>
				{message ? (
					<p className="text-foreground text-sm leading-relaxed">{message}</p>
				) : (
					<p className="text-muted-foreground text-sm">Tu mensaje aparecerá aquí...</p>
				)}
			</div>
			<div className="mt-6 pt-4 border-t border-border">
				<p className="text-xs text-muted-foreground mb-2">Información del envío:</p>
				<ul className="space-y-2 text-xs text-foreground">
					<li className="flex justify-between">
						<span>Destinatarios:</span>
						<span className="font-semibold">{recipients.length}</span>
					</li>
					<li className="flex justify-between">
						<span>Caracteres:</span>
						<span className="font-semibold">{message.length}</span>
					</li>
					<li className="flex justify-between">
						<span>Costo estimado:</span>
						<span className="font-semibold text-primary">${(recipients.length * 0.5).toFixed(2)}</span>
					</li>
				</ul>
			</div>
		</div>
	);
};
