export const ScalaSection = () => {
	return (
		<section className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
			<span>Menos</span>
			<div className="flex gap-1">
				{/* 0 mensajes */}
				<div className="w-3 h-3 rounded-sm bg-zinc-300/70 dark:bg-zinc-700/70" />
				{/* Bajo */}
				<div className="w-3 h-3 rounded-sm bg-pink-300/60" />
				{/* Medio */}
				<div className="w-3 h-3 rounded-sm bg-pink-400/80" />
				{/* Alto */}
				<div className="w-3 h-3 rounded-sm bg-fuchsia-500" />
				{/* Muy alto */}
				<div className="w-3 h-3 rounded-sm bg-orange-500" />
			</div>
			<span>Más</span>
		</section>
	);
};

