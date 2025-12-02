import { Beneficios } from "@/components/welcome/beneficios"
import { InfoSection } from "@/components/welcome/info"
import { getGreeting } from "@/utils/types/welcome"
import { $userStore } from '@clerk/astro/client'

export const WelcomeCard = () => {
	const user = $userStore.get();

	// Usar nombre de Clerk o el override
	const nombre = user?.fullName

	return (
		<div className="space-y-8">
			{/* Greeting Section */}
			<section className="space-y-2">
				<p className="text-sm font-medium text-muted-foreground">
					{getGreeting()} a las{" "}
					{new Date().toLocaleTimeString("es-ES", {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</p>
				<h1 className="text-4xl font-bold text-foreground">
					Hola, <span className="text-primary">{nombre}</span>
				</h1>
				<p className="text-base text-muted-foreground">Bienvenido a la app</p>
			</section>

			{/* Componentes adicionales - Elimínalos si no los necesitas */}
			<InfoSection />
			<Beneficios />
		</div>
	);
};

