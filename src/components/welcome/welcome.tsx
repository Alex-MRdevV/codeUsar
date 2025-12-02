import { Beneficios } from "@/components/welcome/beneficios";
import { InfoSection } from "@/components/welcome/info";
import { getGreeting } from "@/utils/types/welcome";
import { $userStore } from '@clerk/astro/client';
import { useEffect, useState } from 'react';

export const WelcomeCard = () => {
	const user = $userStore.get();
	const nombre = user?.fullName;

	const [isClient, setIsClient] = useState(false);
	const [currentTime, setCurrentTime] = useState('');
	const [greeting, setGreeting] = useState('');

	useEffect(() => {
		setIsClient(true);

		setCurrentTime(
			new Date().toLocaleTimeString("es-ES", {
				hour: "2-digit",
				minute: "2-digit",
			})
		);
		setGreeting(getGreeting());
	}, []);

	return (
		<div className="space-y-8">
			<section className="space-y-2">
				<p className="text-sm font-medium text-muted-foreground">
					{greeting && currentTime && (
						<>{greeting} a las {currentTime}</>
					)}
				</p>

				<h1 className="text-4xl font-bold text-foreground">
					Hola,{" "}
					{isClient && (
						<span className="text-primary">{nombre}</span>
					)}
				</h1>

				<p className="text-base text-muted-foreground">Bienvenido a la app</p>
			</section>

			<InfoSection />
			<Beneficios />
		</div>
	);
};
