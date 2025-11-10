import { CurrentSelection } from "@/components/messages/phoneConfig/currentSelection";
import { PhoneList } from "@/components/messages/phoneConfig/phoneList";
import { Card } from "@/components/ui/card";
import {
	activePhoneId,
	addPhone,
	getActivePhone,
	phoneItems,
	setActivePhone
} from "@/stores/phone";
import type { PhoneData } from "@/utils/types/message";
import { useStore } from "@nanostores/react";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export function PhoneConfig() {
	const phones = useStore(phoneItems);
	const selectedId = useStore(activePhoneId);

	// Cargar teléfonos desde la API
	useEffect(() => {
		const fetchPhones = async () => {
			try {
				const response = await fetch('/api/phones');
				const data: PhoneData[] = await response.json();

				// Agregar cada teléfono a la store
				data.forEach(phone => {
					addPhone({ id: phone.id, number: phone.number });
				});
			} catch (error) {
				console.error('Error al cargar teléfonos:', error);
			}
		};

		fetchPhones();
	}, []);

	const handleSelectPhone = (id: string) => {
		setActivePhone(id);
	};

	const handleCopyPhone = (number: string) => {
		navigator.clipboard.writeText(number);
	};

	// Convertir el objeto de phones a array para el mapeo
	const phonesArray = Object.values(phones) as PhoneData[];
	const selectedPhone = getActivePhone();

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-foreground mb-2">Configuración de Teléfonos</h1>
				<p className="text-muted-foreground">Gestiona tus números de teléfono para producción, prueba y desarrollo</p>
			</div>

			{/* Current Selection */}
			<CurrentSelection selectedPhone={selectedPhone} />

			{/* Phone List by Type */}
			<PhoneList
				phonesArray={phonesArray}
				selectedId={selectedId}
				onSelectPhone={handleSelectPhone}
				onCopyPhone={handleCopyPhone}
			/>

			{/* Info Box */}
			<Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 p-4">
				<div className="flex gap-3">
					<AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
					<div className="text-sm text-blue-900 dark:text-blue-200">
						<p className="font-semibold mb-1">Información sobre números</p>
						<p>
							Selecciona el número que deseas usar por defecto para enviar mensajes. Este se guardará automáticamente.
						</p>
					</div>
				</div>
			</Card>
		</div>
	);
}
