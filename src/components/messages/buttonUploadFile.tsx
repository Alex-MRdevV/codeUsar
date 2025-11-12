interface Props {
	handleImportRecipients: (file: File) => void
	recipients: string[]
}

export const UploadFile = ({ handleImportRecipients, recipients }: Props) => {
	return (
		<article className="bg-card border border-border rounded-lg p-6">
			<h3 className="text-sm font-semibold text-foreground mb-4">
				Destinatarios
			</h3>

			<article className="space-y-4">
				<section className="flex items-center gap-4">
					<label className="text-sm font-medium text-foreground">
						Importar desde archivo:
					</label>
					<input
						type="file"
						accept=".csv,.txt"
						onChange={(e) => {
							if (e.target.files?.[0]) {
								handleImportRecipients(e.target.files[0]);
							}
						}}
						className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
					/>
				</section>

				{recipients.length > 0 && (
					<div className="p-3 bg-muted/20 rounded-lg">
						<p className="text-sm text-foreground">
							<span className="font-semibold">{recipients.length}</span> destinatario{recipients.length !== 1 ? 's' : ''} agregado{recipients.length !== 1 ? 's' : ''}
						</p>
					</div>
				)}
			</article>
		</article>
	)
}
