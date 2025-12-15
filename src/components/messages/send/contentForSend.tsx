import { TemplateSelector } from "@/components/messages/editor/templaterSelector";
import { ResultsCard } from "@/components/messages/resultsCard";
import type { ContentForSendProps } from "@/utils/types/messages";

export const ContentForSend = ({ handleNewSend, handleTemplateChange, resultados, selectedTemplate, templates, dataMensajes, getRecipientCount, getTargetStatusForTemplate, currentTemplate }: ContentForSendProps) => {
	return (
		<section className="space-y-4 lg:col-span-2">
			{resultados ? (
				<div className="space-y-4">
					<ResultsCard resultados={resultados} onClose={handleNewSend} />
					<button
						onClick={handleNewSend}
						className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-semibold"
					>
						Enviar nuevos mensajes
					</button>
				</div>
			) : (
				<>
					<TemplateSelector
						value={selectedTemplate}
						templates={templates}
						onChange={handleTemplateChange}
					/>

					{selectedTemplate && dataMensajes && (
						<div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs">
							<p className="text-blue-600">
								📊 Se enviarán mensajes a{" "}
								<strong className="font-semibold">{getRecipientCount()}</strong> clientes en
								estado{" "}
								<strong className="font-semibold">
									{getTargetStatusForTemplate(currentTemplate?.metaTemplateName || "").toUpperCase()}
								</strong>
							</p>
						</div>
					)}
				</>
			)}
		</section>
	)
}
