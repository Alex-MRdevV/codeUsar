import { ButtonEnvio } from "@/components/messages/buttonEnvio";
import { CreateTemplateModal } from "@/components/messages/editor/modalTemplates";
import { PreviewCardContainer } from "@/components/messages/editor/previewCardContainer";
import { TemplateSelector } from "@/components/messages/editor/templaterSelector";
import { VariableEditor } from "@/components/messages/editor/variablesEditor";
import { Header } from "@/components/messages/header";
import { ResultsCard } from "@/components/messages/resultsCard";
import { ProgressComponent } from "@/components/progress";
import type { SendViewComponentProps } from "@/utils/types/messages";
import { MessagesFlyingCards } from "../flyingMessages";

export const ContentSendComponent = ({ canSend, currentTemplate, dataClientesRuta, dataMensajes, getRecipientCount, getTargetStatusForTemplate, handleCreateTemplate, handleNewSend, handleSendMessage, handleTemplateChange, hasVars, isSubmitting, recipients, resultados, selectedTemplate, setShowCreateModal, setVariableValues, showCreateModal, templates, variableValues, vars, cancel, completed, currentBatch, error, isCancelled, isPaused, isProcessing, pause, progress, reset, resume, totalBatches,flyingMessages }: SendViewComponentProps) => {
	return (
		<article className="p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 w-full max-w-[1800px] mx-auto">
			<Header setShowCreateModal={setShowCreateModal} />

			<MessagesFlyingCards messages={flyingMessages} />

			<section className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<section className="col-span-1 md:col-span-2 space-y-4">
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

							{hasVars && (
								<section className="bg-card border border-border rounded-lg p-4">
									<div className="mb-3 p-3 bg-green-500/10 border border-green-500/20 rounded">
										<p className="text-xs text-green-600">
											✨ Las variables se completarán automáticamente con los datos de cada cliente.
											Puedes sobrescribirías manualmente si lo necesitas.
										</p>
									</div>
									<VariableEditor
										variables={vars!}
										values={variableValues}
										onChange={setVariableValues}
									/>
								</section>
							)}

							<ButtonEnvio
								canSend={canSend}
								handleSendMessage={handleSendMessage}
								isSubmitting={isSubmitting}
								recipients={recipients}
							/>

							{!canSend() && selectedTemplate && (
								<div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
									<p className="text-xs text-yellow-600">
										{!dataClientesRuta
											? "⚠️ No hay datos cargados. Carga un archivo primero."
											: recipients.length === 0
												? "⚠️ No hay clientes en el estado correspondiente para esta plantilla."
												: "⚠️ Completa todas las variables requeridas antes de enviar"}
									</p>
								</div>
							)}
						</>
					)}
				</section>

				<section className="col-span-1 space-y-4">
					{(isProcessing || isPaused || completed || error || isCancelled) && (
						<div className="sticky top-4">
							<ProgressComponent
								error={error}
								isCancelled={isCancelled}
								completed={completed}
								isProcessing={isProcessing}
								progress={progress}
								currentBatch={currentBatch}
								totalBatches={totalBatches}
								isPaused={isPaused}
								onCancel={cancel}
								onPause={pause}
								onResume={resume}
								onReset={reset}
								title="Envío de Mensajes"
								showCancelButton={true}
							/>
						</div>
					)}

					{!resultados && currentTemplate && (
						<div className="sticky top-4">
							<PreviewCardContainer
								recipients={recipients}
								template={currentTemplate}
							/>
						</div>
					)}
				</section>
			</section>

			{showCreateModal && (
				<CreateTemplateModal
					onClose={() => setShowCreateModal(false)}
					onSuccess={handleCreateTemplate}
				/>
			)}
		</article>
	)
}
