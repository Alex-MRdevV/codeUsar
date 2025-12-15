import { ProcessResults } from "@/components/messages/messagesIndividual/resultsProcess"
import { SectionMain } from "@/components/messages/messagesIndividual/sectionMain"
import { ResultsCard } from "@/components/messages/resultsCard"
import type { SectionConsolidadoProps } from "@/utils/types/send"

export const SectionConsolidado = ({ cancel, completed, currentBatch, currentTemplate, error, isCancelled, isPaused, isProcessing, pause, progress, recipients, reset, resultados, resume, totalBatches, handleNewSend, canSend, dataClientesRuta, getRecipientCount, handleSendMessagesWrapper, isSubmitting, addClientToRuta, addDataMessageTemplates, addManualMessage, content, handleTemplateChange, handleVariableChange, hasVariables, isManual, name, phone, selectedTemplate, setContent, setName, setPhone, templates, variableValues, uiMessages, removeFromOriginalSource }: SectionConsolidadoProps) => {
	return (
		<article className="container mx-auto p-6 space-y-6">
			<section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{resultados && (
					<div className="lg:col-span-3 space-y-4">
						<ResultsCard resultados={resultados} onClose={handleNewSend} />
						<button
							onClick={handleNewSend}
							className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold shadow"
						>
							Enviar nuevos mensajes
						</button>
					</div>
				)}

				<SectionMain
					addClientToRuta={addClientToRuta}
					addDataMessageTemplates={addDataMessageTemplates}
					addManualMessage={addManualMessage}
					canSend={canSend}
					content={content}
					currentTemplate={currentTemplate}
					dataClientesRuta={dataClientesRuta}
					getRecipientCount={getRecipientCount}
					handleSendMessagesWrapper={handleSendMessagesWrapper}
					handleTemplateChange={handleTemplateChange}
					handleVariableChange={handleVariableChange}
					hasVariables={hasVariables}
					isManual={isManual}
					isSubmitting={isSubmitting}
					name={name}
					phone={phone}
					recipients={recipients}
					selectedTemplate={selectedTemplate}
					setContent={setContent}
					setName={setName}
					setPhone={setPhone}
					templates={templates}
					variableValues={variableValues}
					uiMessages={uiMessages}
					removeFromOriginalSource={removeFromOriginalSource}
				/>

				<ProcessResults
					cancel={cancel}
					completed={completed}
					currentBatch={currentBatch}
					currentTemplate={currentTemplate}
					error={error}
					isCancelled={isCancelled}
					isPaused={isPaused}
					isProcessing={isProcessing}
					pause={pause}
					progress={progress}
					recipients={recipients}
					reset={reset}
					resultados={resultados}
					resume={resume}
					totalBatches={totalBatches}
				/>
			</section>
		</article>
	)
}
