import ContactSelector from "@/components/editorMensajes/ContactSelector"
import InfoCard from "@/components/editorMensajes/InfoCard"
import MessageTemplates from "@/components/editorMensajes/MessageTemplates"
import MessageTextarea from "@/components/editorMensajes/MessageTextarea"
import ScheduleMessage from "@/components/editorMensajes/ScheduleMessage"
import SendButton from "@/components/editorMensajes/SendButton"
import { useState } from "react"

export const MessageEditor = () => {
	const [message, setMessage] = useState("")
	const [selectedContacts, setSelectedContacts] = useState<string[]>([])
	const [schedule, setSchedule] = useState(false)
	const [scheduleTime, setScheduleTime] = useState("")
	const [variables, setVariables] = useState(false)

	const contacts = ["Todos los contactos", "Clientes", "Proveedores", "Grupo VIP"]
	const messageTemplates = [
		"¡Hola {nombre}! Te invitamos a conocer nuestras promociones.",
		"Gracias {nombre} por tu compra. Tu pedido ha sido confirmado.",
		"Recordatorio: Tu cita está programada para {fecha}.",
	]

	return (
		<div className="p-8 md:p-6 sm:p-4">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-4xl font-bold mb-2 sm:text-2xl">Enviar Mensajes</h1>
				<p className="text-muted-foreground">Crea y envía campañas masivas a WhatsApp</p>
			</div>

			<div className="grid grid-cols-3 gap-8 lg:grid-cols-1">
				{/* Main Editor */}
				<div className="col-span-2 space-y-6 lg:col-span-1">
					{/* Templates */}
					<MessageTemplates
						templates={messageTemplates}
						onSelectTemplate={(template) => setMessage(template)}
					/>

					{/* Message Textarea */}
					<MessageTextarea
						message={message}
						onMessageChange={setMessage}
						variablesEnabled={variables}
						onToggleVariables={() => setVariables(!variables)}
					/>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Select Contacts */}
					<ContactSelector
						contacts={contacts}
						selectedContacts={selectedContacts}
						onContactChange={(contact, selected) => {
							if (selected) {
								setSelectedContacts([...selectedContacts, contact])
							} else {
								setSelectedContacts(selectedContacts.filter((c) => c !== contact))
							}
						}}
					/>

					{/* Schedule */}
					<ScheduleMessage
						schedule={schedule}
						scheduleTime={scheduleTime}
						onToggleSchedule={() => setSchedule(!schedule)}
						onScheduleTimeChange={setScheduleTime}
					/>

					{/* Send Button */}
					<SendButton
						schedule={schedule}
						onSend={() => {
							// Lógica para enviar el mensaje
							alert(schedule ? "Mensaje programado" : "Mensaje enviado")
						}}
					/>

					{/* Info Card */}
					<InfoCard message="Los mensajes se envían de forma masiva y personalizada. Comprueba tu conexión de WhatsApp." />
				</div>
			</div>
		</div>
	)
}
