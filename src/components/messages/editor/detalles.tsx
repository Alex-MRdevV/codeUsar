import type { EventDetailsProps } from "@/utils/types/editorMessages";

export const EventDetails = ({ event }: EventDetailsProps) => {
	return (
		<article className="mt-4 pt-4 border-t border-border space-y-3">
			<div>
				<p className="text-xs font-semibold text-muted-foreground mb-1">Mensaje:</p>
				<p className="text-sm text-foreground bg-muted/30 p-3 rounded-md">{event.message}</p>
			</div>
			{event.error && (
				<div>
					<p className="text-xs font-semibold text-destructive mb-1">Error:</p>
					<p className="text-sm text-destructive/80 bg-destructive/10 p-3 rounded-md">{event.error}</p>
				</div>
			)}
			{event.metadata && Object.keys(event.metadata).length > 0 && (
				<div>
					<p className="text-xs font-semibold text-muted-foreground mb-1">Información adicional:</p>
					<pre className="text-xs bg-muted/30 p-3 rounded-md overflow-auto text-foreground">
						{JSON.stringify(event.metadata, null, 2)}
					</pre>
				</div>
			)}
		</article>
	);
};
