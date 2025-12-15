import { ButtonEnvio } from "@/components/messages/buttonEnvio";
import { AddMessageFormComponent } from "@/components/messages/messagesIndividual/addMessages/addMessage";
import { MessageList } from "@/components/messages/messagesIndividual/messagesList";
import { getTargetStatusForTemplate } from "@/utils/types/messages";
import type { SectionMainProps } from "@/utils/types/send";

export const SectionMain = ({ addClientToRuta, addDataMessageTemplates, addManualMessage, content, currentTemplate, handleTemplateChange, handleVariableChange, hasVariables, isManual, name, phone, selectedTemplate, setContent, setName, setPhone, templates, variableValues, handleSendMessagesWrapper, getRecipientCount, isSubmitting, recipients, canSend, dataClientesRuta, uiMessages,removeFromOriginalSource }: SectionMainProps) => {
	return (
		<section className="lg:col-span-2 space-y-4">
			<div className="bg-card border border-border rounded-xl shadow-sm p-5 space-y-4">
				<AddMessageFormComponent
					currentTemplate={currentTemplate}
					handleTemplateChange={handleTemplateChange}
					handleVariableChange={handleVariableChange}
					hasVariables={hasVariables}
					selectedTemplate={selectedTemplate}
					templates={templates}
					variableValues={variableValues}
					content={content}
					setContent={setContent}
					name={name}
					setName={setName}
					setPhone={setPhone}
					phone={phone}
					addClientToRuta={addClientToRuta}
					addManualMessage={addManualMessage}
					addDataMessageTemplates={addDataMessageTemplates}
					isManual={isManual}
				/>
			</div>

			{selectedTemplate && (
				<div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs shadow-sm">
					<p className="text-blue-600">
						📊 Se enviarán mensajes a{" "}
						<strong>{getRecipientCount()}</strong> clientes en estado{" "}
						<strong>
							{getTargetStatusForTemplate(currentTemplate?.metaTemplateName || "").toUpperCase()}
						</strong>
					</p>
				</div>
			)}

			<ButtonEnvio
				canSend={canSend}
				handleSendMessage={handleSendMessagesWrapper}
				isSubmitting={isSubmitting}
				recipients={recipients}
			/>

			{!canSend() && selectedTemplate && (
				<div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs shadow-sm">
					<p className="text-yellow-700">
						{!dataClientesRuta.length
							? "⚠️ No hay clientes cargados."
							: recipients.length === 0
								? "⚠️ No hay clientes en el estado correcto para esta plantilla."
								: "⚠️ Completa todas las variables para continuar."}
					</p>
				</div>
			)}

			<div className="bg-card border border-border rounded-xl shadow-sm p-5">
				<h3 className="text-sm font-medium text-foreground mb-3">
					Mensajes preparados
				</h3>

				<MessageList
					messages={uiMessages}
					onRemove={(id) => removeFromOriginalSource(id)}
				/>
			</div>
		</section>
	)
}
