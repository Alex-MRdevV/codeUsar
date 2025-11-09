import { Beneficios } from "@/components/welcome/beneficios"
import { InfoSection } from "@/components/welcome/info"
import { formatTimeSaved, getGreeting, type WelcomeCardProps } from "@/utils/types/welcome"
import { Clock, MessageCircle, Users } from "lucide-react"

export const WelcomeCard = ({ nombre, stats }: WelcomeCardProps) => {
	return (
		<div className="space-y-8">
			{/* Greeting Section */}
			<section className="space-y-2">
				<p className="text-sm font-medium text-muted-foreground">
					{getGreeting()} a las {new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
				</p>
				<h1 className="text-4xl font-bold text-foreground">
					Hola, <span className="text-primary">{nombre}</span>
				</h1>
				<p className="text-base text-muted-foreground">Bienvenido a la app</p>
			</section>

			{/* Quick Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* Messages Card */}
				<section className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
					<section className="flex items-start justify-between">
						<div className="space-y-2">
							<p className="text-sm text-muted-foreground">Mensajes Enviados</p>
							<p className="text-3xl font-bold text-foreground">
								{stats.totalMessagesSent.toLocaleString("es-ES")}
							</p>
						</div>
						<div className="p-3 bg-primary/10 rounded-lg">
							<MessageCircle className="w-6 h-6 text-primary" />
						</div>
					</section>
				</section>

				{/* Time Saved Card */}
				<section className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
					<section className="flex items-start justify-between">
						<div className="space-y-2">
							<p className="text-sm text-muted-foreground">Tiempo Ahorrado</p>
							<p className="text-3xl font-bold text-foreground">
								{formatTimeSaved(stats.totalTimeSavedHours)}
							</p>
						</div>
						<div className="p-3 bg-primary/10 rounded-lg">
							<Clock className="w-6 h-6 text-primary" />
						</div>
					</section>
				</section>

				{/* Contacts Card */}
				<section className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
					<section className="flex items-start justify-between">
						<div className="space-y-2">
							<p className="text-sm text-muted-foreground">Contactos</p>
							<p className="text-3xl font-bold text-foreground">
								{stats.totalContacts.toLocaleString("es-ES")}
							</p>
						</div>
						<div className="p-3 bg-primary/10 rounded-lg">
							<Users className="w-6 h-6 text-primary" />
						</div>
					</section>
				</section>
			</div>

			<InfoSection />
			<Beneficios />
		</div>
	)
}
