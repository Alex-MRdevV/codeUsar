import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SetStateAction } from "react"

interface Props {
	setShowCreateModal: (value: SetStateAction<boolean>) => void
}

export const Header = ({ setShowCreateModal }: Props) => {
	return (
		<header className="mb-8 w-full ">
			<div className="
				flex flex-col md:flex-row
				items-start md:items-center
				justify-between
				gap-4 md:gap-0 mb-4 w-full
			">
				<div className="w-full">
					<h1 className="
						text-3xl md:text-4xl font-bold
						bg-linear-to-r from-primary to-info
						bg-clip-text text-transparent mb-2
					">
						Envío Masivo de Mensajes
					</h1>
					<p className="text-muted-foreground text-sm md:text-base">
						Gestiona y envía mensajes personalizados a tus clientes
					</p>
				</div>

				<Button
					onClick={() => setShowCreateModal(true)}
					className="
						bg-primary hover:bg-primary/90
						text-primary-foreground gap-2
						w-full md:w-auto
					"
				>
					<Plus size={20} />
					Nueva Plantilla
				</Button>
			</div>
		</header>
	)
}
