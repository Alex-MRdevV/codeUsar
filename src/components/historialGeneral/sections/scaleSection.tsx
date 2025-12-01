export const ScalaSection = () => {
	return (
		<section className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
			<span>Menos</span>
			<div className="flex gap-1">
				<div className="w-3 h-3 rounded-sm bg-muted" />
				<div className="w-3 h-3 rounded-sm bg-primary/20" />
				<div className="w-3 h-3 rounded-sm bg-primary/40" />
				<div className="w-3 h-3 rounded-sm bg-primary/60" />
				<div className="w-3 h-3 rounded-sm bg-primary" />
			</div>
			<span>Más</span>
		</section>
	)
}
