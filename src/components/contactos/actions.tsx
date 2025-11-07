import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Plus, Search, Upload } from "lucide-react";
import { useState } from "react";

interface ActionsProps {
	onAddContact: () => void;
	onImportContacts: () => void; 
	onExportContacts: () => void;
}

export const Actions = ({
	onAddContact,
	onImportContacts,
	onExportContacts,
}: ActionsProps) => {
	const [searchTerm, setSearchTerm] = useState("");

	return (
		<Card className="bg-card border-border p-6 mb-6">
			<div className="flex flex-col sm:flex-row gap-4">
				{/* Barra de búsqueda */}
				<section className="flex-1 relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
					<Input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Buscar por nombre, teléfono o email..."
						className="pl-10 w-full bg-input border-border text-foreground placeholder-muted-foreground"
					/>
				</section>

				{/* Botones de acción */}
				<article className="flex gap-2">
					<Button
						className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
						onClick={onAddContact}
					>
						<Plus className="w-4 h-4" />
						Nuevo Contacto
					</Button>
					<Button
						variant="outline"
						className="border-border text-foreground hover:bg-muted/50 gap-2 bg-transparent"
						onClick={onImportContacts}
					>
						<Upload className="w-4 h-4" />
						Importar
					</Button>
					<Button
						variant="outline"
						className="border-border text-foreground hover:bg-muted/50 gap-2 bg-transparent"
						onClick={onExportContacts}
					>
						<Download className="w-4 h-4" />
						Exportar
					</Button>
				</article>
			</div>
		</Card>
	);
};
