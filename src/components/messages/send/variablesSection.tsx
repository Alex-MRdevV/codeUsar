import { ButtonEnvio } from "@/components/messages/buttonEnvio";
import { TemplateSelector } from "@/components/messages/editor/templaterSelector";
import { VariableEditor } from "@/components/messages/editor/variablesEditor";
import { InfoAlert, ValidationWarning } from "@/components/messages/send/sendViewComponent";
import type { SendViewComponentProps } from "@/utils/types/messages";
import type { Dispatch, SetStateAction } from "react";

export const VariablesSection = ({
	vars,
	variableValues,
	setVariableValues
}: {
	vars: NonNullable<SendViewComponentProps['vars']>;
	variableValues: Record<string, string>;
	setVariableValues: Dispatch<SetStateAction<Record<string, string>>>;
}) => (
	<div className="bg-card border border-border rounded-lg p-4">
		<div className="mb-3 p-3 bg-green-500/10 border border-green-500/20 rounded">
			<p className="text-xs text-green-600">
				✨ Las variables se completarán automáticamente con los datos de cada cliente.
				Puedes sobrescribirlas manualmente si lo necesitas.
			</p>
		</div>
		<VariableEditor variables={vars} values={variableValues} onChange={setVariableValues} />
	</div>
);

export const SendForm = ({
	selectedTemplate,
	templates,
	dataMensajes,
	currentTemplate,
	hasVars,
	vars,
	variableValues,
	canSend,
	recipients,
	dataClientesRuta,
	handleTemplateChange,
	getRecipientCount,
	getTargetStatusForTemplate,
	setVariableValues,
	handleSendMessage,
	isSubmitting
}: Omit<SendViewComponentProps, 'resultados' | 'handleNewSend' | 'showCreateModal' | 'setShowCreateModal' | 'handleCreateTemplate'>) => (
	<>
		<TemplateSelector value={selectedTemplate} templates={templates} onChange={handleTemplateChange} />

		{selectedTemplate && dataMensajes && currentTemplate && (
			<InfoAlert
				recipientCount={getRecipientCount()}
				status={getTargetStatusForTemplate(currentTemplate.metaTemplateName || "")}
			/>
		)}

		{hasVars && vars && (
			<VariablesSection vars={vars} variableValues={variableValues} setVariableValues={setVariableValues} />
		)}

		<ButtonEnvio canSend={canSend} handleSendMessage={handleSendMessage} isSubmitting={isSubmitting} recipients={recipients} />

		{!canSend() && (
			<ValidationWarning dataClientesRuta={dataClientesRuta} recipients={recipients} selectedTemplate={selectedTemplate} />
		)}
	</>
);
