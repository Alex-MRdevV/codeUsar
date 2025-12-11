import { Card } from "@/components/ui/card";

export const PreviewCardContainer = ({ recipients, template }: any) => {
	return (
		<Card className="p-4">
			<h3 className="font-semibold mb-2">Vista Previa</h3>
			<p className="text-sm text-muted-foreground">
				Plantilla: {template?.name}
			</p>
			<p className="text-sm text-muted-foreground">
				Destinatarios: {recipients?.length || 0}
			</p>
		</Card>
	);
};
