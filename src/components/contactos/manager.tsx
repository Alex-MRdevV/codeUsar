import { Card } from "@/components/ui/card";

interface Props {
	data: {
		label: string;
		value: string;
	}[];
}

export const ManagerContactos = ({ data }: Props) => {
	return (
		<>
			<section className="mb-8">
				<h1 className="text-3xl font-bold text-foreground dark:text-foreground-dark mb-2">
					Gestión de Contactos
				</h1>
				<p className="text-muted-foreground dark:text-muted-foreground-dark">
					Administra tus contactos y grupos de distribución
				</p>
			</section>

			{/* Stats */}
			<section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
				{data.map((stat, idx) => (
					<Card
						key={idx}
						className="bg-card dark:bg-card-dark border-border dark:border-border-dark p-4"
					>
						<p className="text-muted-foreground dark:text-muted-foreground-dark text-sm mb-2">
							{stat.label}
						</p>
						<p className="text-2xl font-bold text-foreground dark:text-foreground-dark">
							{stat.value}
						</p>
					</Card>
				))}
			</section>
		</>
	);
};
