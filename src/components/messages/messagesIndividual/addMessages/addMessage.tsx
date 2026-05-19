import { ContactFields, ManualMessageField } from "@/components/messages/messagesIndividual/addMessages/campos";
import { TemplateVariables } from "@/components/messages/messagesIndividual/addMessages/templaterVariables";
import { TemplateSelector } from "@/components/messages/messagesIndividual/addMessages/templateSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AddMessageFormProps } from "@/utils/types/send";
import { Plus } from "lucide-react";

export const AddMessageFormComponent = (props: AddMessageFormProps) => {
	const {
		addClientToRuta,
		addDataMessageTemplates,
		addManualMessage,
		currentTemplate,
		isManual,
		templates,
		selectedTemplate,
		handleTemplateChange,
		hasVariables,
		variableValues,
		handleVariableChange,
		phone,
		setPhone,
		name,
		setName,
		content,
		setContent
	} = props;

	const isRutaTemplate = currentTemplate?.metaTemplateName === "pedidosenrutados";

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (isRutaTemplate) {
			addClientToRuta();
		} else if (isManual) {
			addManualMessage();
		} else {
			addDataMessageTemplates();
		}
	};

	return (
		<Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-200">
			<CardHeader className="pb-4 border-b border-border/50">
				<CardTitle className="flex items-center gap-2 text-lg font-semibold">
					<div className="p-1.5 rounded-md bg-primary/10">
						<Plus className="w-5 h-5 text-primary" />
					</div>
					Agregar Mensaje
				</CardTitle>
			</CardHeader>

			<CardContent className="pt-6">
				<form onSubmit={handleSubmit} className="space-y-5">
					<TemplateSelector
						templates={templates}
						selectedTemplate={selectedTemplate}
						currentTemplate={currentTemplate}
						handleTemplateChange={handleTemplateChange}
						isRutaTemplate={isRutaTemplate}
					/>

					{currentTemplate && hasVariables && (
						<TemplateVariables
							currentTemplate={currentTemplate}
							variableValues={variableValues}
							handleVariableChange={handleVariableChange}
						/>
					)}

					<ContactFields
						phone={phone}
						setPhone={setPhone}
						name={name}
						setName={setName}
					/>

					{isManual && (
						<ManualMessageField
							content={content}
							setContent={setContent}
						/>
					)}

					<Button
						type="submit"
						className="w-full bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200"
					>
						<Plus className="w-4 h-4 mr-2" />
						Agregar a la lista
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};
