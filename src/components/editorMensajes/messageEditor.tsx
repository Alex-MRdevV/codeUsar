"use client"

import { useState } from "react"

export default function MessageEditor() {
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
					<div className="bg-card border border-border rounded-xl p-6">
						<h2 className="text-lg font-semibold mb-4">Plantillas</h2>
						<div className="space-y-2">
							{messageTemplates.map((template, idx) => (
								<button
									key={idx}
									onClick={() => setMessage(template)}
									className="w-full text-left p-3 bg-border/30 hover:bg-border/50 rounded-lg transition-colors duration-200 text-sm"
								>
									{template}
								</button>
							))}
						</div>
					</div>

					{/* Message Textarea */}
					<div className="bg-card border border-border rounded-xl p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold">Mensaje</h2>
							<button
								onClick={() => setVariables(!variables)}
								className="text-xs bg-primary/20 text-primary px-2 py-1 rounded transition-colors duration-200"
							>
								Variables: {variables ? "ON" : "OFF"}
							</button>
						</div>
						<textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Escribe tu mensaje aquí... Usa {nombre}, {email}, {fecha} para variables personalizadas"
							className="w-full h-48 bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none sm:h-32"
						/>
						<div className="mt-4 flex items-center justify-between">
							<p className="text-sm text-muted-foreground">{message.length} / 1000 caracteres</p>
							<button className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200">
								👁️ Previsualizar
							</button>
						</div>
					</div>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Select Contacts */}
					<div className="bg-card border border-border rounded-xl p-6">
						<h2 className="text-lg font-semibold mb-4">Destinatarios</h2>
						<div className="space-y-2">
							{contacts.map((contact, idx) => (
								<label
									key={idx}
									className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors duration-200"
								>
									<input
										type="checkbox"
										checked={selectedContacts.includes(contact)}
										onChange={(e) => {
											if (e.target.checked) {
												setSelectedContacts([...selectedContacts, contact])
											} else {
												setSelectedContacts(selectedContacts.filter((c) => c !== contact))
											}
										}}
										className="w-4 h-4 rounded border-border bg-input cursor-pointer"
									/>
									<span className="text-sm">{contact}</span>
									<span className="text-xs text-muted-foreground ml-auto">{Math.floor(Math.random() * 1000)}</span>
								</label>
							))}
						</div>
						<div className="mt-4 bg-primary/10 border border-primary/20 rounded-lg p-3">
							<p className="text-sm text-primary font-semibold">
								Total: {selectedContacts.length * 100} contactos seleccionados
							</p>
						</div>
					</div>

					{/* Schedule */}
					<div className="bg-card border border-border rounded-xl p-6">
						<label className="flex items-center gap-3 cursor-pointer mb-4">
							<input
								type="checkbox"
								checked={schedule}
								onChange={(e) => setSchedule(e.target.checked)}
								className="w-4 h-4 rounded border-border bg-input cursor-pointer"
							/>
							<span className="text-lg font-semibold">Programar Envío</span>
						</label>
						{schedule && (
							<div className="space-y-3">
								<input
									type="datetime-local"
									value={scheduleTime}
									onChange={(e) => setScheduleTime(e.target.value)}
									className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
								/>
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									📅 Se enviará el {scheduleTime ? new Date(scheduleTime).toLocaleDateString() : "selecciona una fecha"}
								</div>
							</div>
						)}
					</div>

					{/* Send Button */}
					<button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
						✉️ {schedule ? "Programar Envío" : "Enviar Ahora"}
					</button>

					{/* Info Card */}
					<div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4">
						<p className="text-xs text-secondary/80">
							<strong>Consejo:</strong> Los mensajes se envían de forma masiva y personalizada. Comprueba tu conexión de
							WhatsApp.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
