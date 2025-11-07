interface ContactSelectorProps {
	contacts: string[];
	selectedContacts: string[];
	onContactChange: (contact: string, selected: boolean) => void;
}

export default function ContactSelector({ contacts, selectedContacts, onContactChange }: ContactSelectorProps) {
	return (
		<section className="bg-card border border-border rounded-xl p-6">
			<h2 className="text-lg font-semibold mb-4">Destinatarios</h2>
			<section className="space-y-2">
				{contacts.map((contact, idx) => (
					<label
						key={idx}
						className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors duration-200"
					>
						<input
							type="checkbox"
							checked={selectedContacts.includes(contact)}
							onChange={(e) => onContactChange(contact, e.target.checked)}
							className="w-4 h-4 rounded border-border bg-input cursor-pointer"
						/>
						<span className="text-sm">{contact}</span>
						<span className="text-xs text-muted-foreground ml-auto">{Math.floor(Math.random() * 1000)}</span>
					</label>
				))}
			</section>
			<div className="mt-4 bg-primary/10 border border-primary/20 rounded-lg p-3">
				<p className="text-sm text-primary font-semibold">
					Total: {selectedContacts.length * 100} contactos seleccionados
				</p>
			</div>
		</section>
	);
}
