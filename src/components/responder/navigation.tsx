import { cn } from "@/lib/utils"
import { MessageSquare, Settings } from "lucide-react"

interface NavigationProps {
	currentPath?: string
}

export function Navigation({ currentPath = "/" }: NavigationProps) {
	const links = [
		{
			path: "/user/send",
			label: "Enviar Mensajes",
			icon: MessageSquare,
		},
		{
			path: "/user/responder",
			label: "Responder Mensajes",
			icon: Settings,
		},
	]

	const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
		// Prevenir navegación por defecto
		e.preventDefault()

		// Verificar si View Transitions está disponible
		// @ts-ignore
		if (document.startViewTransition) {
			// @ts-ignore
			document.startViewTransition(() => {
				window.location.href = path
			})
		} else {
			// Fallback para navegadores sin soporte
			window.location.href = path
		}
	}

	return (
		<nav className="border-b border-border bg-card">
			<div className="max-w-7xl mx-auto px-4 md:px-8">
				<div className="flex items-center gap-8 h-16">
					{links.map((link) => {
						const Icon = link.icon
						const isActive = currentPath === link.path

						return (
							<a
								key={link.path}
								href={link.path}
								onClick={(e) => handleNavClick(e, link.path)}
								className={cn(
									"flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors relative",
									isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
								)}
							>
								<Icon className="w-4 h-4" />
								<span>{link.label}</span>
								{isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
							</a>
						)
					})}
				</div>
			</div>
		</nav>
	)
}
