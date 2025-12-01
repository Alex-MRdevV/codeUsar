import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SetStateAction } from "react"

interface Props {
	setShowCreateModal: (value: SetStateAction<boolean>) => void
}

export const Header = ({ setShowCreateModal }: Props) => {
	return (
		<header className="mb-8">
			<div className="flex items-center justify-between mb-4">
				<div>
					<h1 className="text-4xl font-bold bg-linear-to-r from-primary to-info bg-clip-text text-transparent mb-2">
						Envío Masivo de Mensajes
					</h1>
					<p className="text-muted-foreground">
						Gestiona y envía mensajes personalizados a tus clientes
					</p>
				</div>
				<Button
					onClick={() => setShowCreateModal(true)}
					className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
				>
					<Plus size={20} />
					Nueva Plantilla
				</Button>
			</div>
		</header>
	)
}
