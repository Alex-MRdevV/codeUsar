import { Button } from "@/components/ui/button"

interface Props {
	closeModal: () => void
	isOpen: boolean
}

export const InfoTemplateAprobation = ({ closeModal, isOpen }: Props) => {
	return (
		<>
			<div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
				<p className="text-sm text-blue-600 dark:text-blue-400">
					ℹ️ Las plantillas requieren aprobación de Meta. Esto puede tardar hasta 48 horas.
				</p>
			</div>

			{/* Botones */}
			<div className="flex gap-3 justify-end">
				<Button
					type="button"
					onClick={closeModal}
					variant="outline"
					disabled={isOpen}
				>
					Cancelar
				</Button>
				<Button
					type="submit"
					disabled={isOpen}
					className="bg-primary hover:bg-primary/90 text-primary-foreground"
				>
					{isOpen ? "Creando..." : "Crear Plantilla"}
				</Button>
			</div>
		</>
	)
}
