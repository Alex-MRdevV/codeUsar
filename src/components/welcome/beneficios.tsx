export const Beneficios = () => {
	return (
		<article className="space-y-3">
			<h2 className="text-lg font-semibold text-foreground">Ventajas principales</h2>
			<section className="grid grid-cols-1 md:grid-cols-2 gap-3">
				<div className="flex gap-2 text-sm">
					<span className="text-primary">✓</span>
					<span className="text-muted-foreground">Reduce llamadas de confirmación por lo menos en un 50%</span>
				</div>
				<div className="flex gap-2 text-sm">
					<span className="text-primary">✓</span>
					<span className="text-muted-foreground">Ahorra hasta 10 horas mensuales en gestión</span>
				</div>
				<div className="flex gap-2 text-sm">
					<span className="text-primary">✓</span>
					<span className="text-muted-foreground">Mensajes personalizados y segmentados</span>
				</div>
				<div className="flex gap-2 text-sm">
					<span className="text-primary">✓</span>
					<span className="text-muted-foreground">Cumple con normativas legales de Meta</span>
				</div>
			</section>
		</article>
	)
}