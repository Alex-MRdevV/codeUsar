export const InfoSection = () => {
	return (
		<article className="bg-card border border-border rounded-lg p-6 space-y-4">
			<h2 className="text-lg font-semibold text-foreground">Para usar</h2>
			<ul className="space-y-3">
				<li className="flex gap-3">
					<span className="text-primary font-semibold">1.</span>
					<span className="text-muted-foreground">Configura tu cuenta de Meta y conecta WhatsApp Business API</span>
				</li>
				<li className="flex gap-3">
					<span className="text-primary font-semibold">2.</span>
					<span className="text-muted-foreground">Importa o crea una lista de contactos para los mensajes</span>
				</li>
				<li className="flex gap-3">
					<span className="text-primary font-semibold">3.</span>
					<span className="text-muted-foreground">Diseña tus mensajes personalizados y automatizados</span>
				</li>
				<li className="flex gap-3">
					<span className="text-primary font-semibold">4.</span>
					<span className="text-muted-foreground">Envía mensajes y monitorea resultados en tiempo real</span>
				</li>
			</ul>
		</article>
	)
}
