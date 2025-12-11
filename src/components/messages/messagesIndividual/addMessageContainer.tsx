import { ButtonEnvio } from "@/components/messages/buttonEnvio";
import { MessagesFlyingCards } from "@/components/messages/flyingMessages";
import { AddMessageFormComponent } from "@/components/messages/messagesIndividual/addMessageForm";
import { PreviewCardContainer } from "@/components/messages/messagesIndividual/previewContainer";
import { ResultsCard } from "@/components/messages/resultsCard";
import { ProgressComponent } from "@/components/progress";
import { useSendMessagesLogic } from "@/hooks/use-sendMessages";
import type { AddMessageFormContainerProps, clientsInRuta, dataUsar, Message } from "@/utils/types/messages";
import { uuid } from "@/utils/uuid";
import { useMemo, useState } from "react";
import { MessageList } from "./messagesList";
import type { Template } from "@/utils/types/templates";

export const AddMessageFormContainer = ({
	templates = [],
	getTargetStatusForTemplate
}: AddMessageFormContainerProps) => {
	const [manualMessages, setManualMessages] = useState<Message[]>([]);
	const [dataMessagesTemplates, setDataMessagesTemplates] = useState<dataUsar[]>([]);
	const [dataClientsRuta, setDataClientsRuta] = useState<clientsInRuta[]>([]);
	const [phone, setPhone] = useState("");
	const [name, setName] = useState("");
	const [content, setContent] = useState("");
	const [selectedTemplate, setSelectedTemplate] = useState<string>("");
	const [variableValues, setVariableValues] = useState<Record<string, string>>({});
	const [horaInicial, setHoraInicial] = useState("");
	const [horaFinal, setHoraFinal] = useState("");

	const currentTemplate = useMemo(
		() => templates.find((t) => t.id === selectedTemplate) || null,
		[templates, selectedTemplate]
	);

	const hasVariables = useMemo(
		() => Boolean(currentTemplate?.variables?.params?.length),
		[currentTemplate]
	);

	const buildMessageFromTemplate = (
		template: Template,
		variableValues: Record<string, string>
	): string => {
		let result = "";

		// HEADER
		if (template.structure.header?.text) {
			result += template.structure.header.text + "\n\n";
		}

		// BODY
		let bodyText = template.structure.body.text;

		if (template.variables) {
			const { format, params } = template.variables;

			if (format === "positional") {
				// Reemplaza {{1}}, {{2}}, etc.
				params.forEach((p, index) => {
					const value = variableValues[p.name] || p.example;
					bodyText = bodyText.replace(
						new RegExp(`{{${index + 1}}}`, "g"),
						value
					);
				});
			}

			if (format === "named") {
				// Reemplaza {{nombre}}, {{codigo}}, etc.
				params.forEach((p) => {
					const value = variableValues[p.name] || p.example;
					bodyText = bodyText.replace(
						new RegExp(`{{${p.placeholder}}}`, "g"),
						value
					);
				});
			}
		}

		result += bodyText + "\n";

		// FOOTER
		if (template.structure.footer?.text) {
			result += "\n" + template.structure.footer.text;
		}

		return result.trim();
	};

	const uiMessages = useMemo(() => {
		const ruta = dataClientsRuta.map((c) => {
			// Tomamos siempre la plantilla de confirmación
			const t = templates.find(
				(t) => t.metaTemplateName === "confirmacion_de_pedido"
			);

			const content = t
				? buildMessageFromTemplate(t, {
					"Hora de inicio": c.horaInicial,
					"Hora de fin": c.horaFinal,
				})
				: "";

			return {
				id: uuid.uuid,
				phone: c.phoneNumber,
				name: "Cliente Ruta",
				content,
			};
		});

		const templated = dataMessagesTemplates.map((d) => {
			const t = templates.find((t) => t.metaTemplateName === d.typeMessage);

			const content = t
				? buildMessageFromTemplate(
					t,
					variableValues // se rellenan con lo que el usuario puso
				)
				: "";

			return {
				id: uuid.uuid,
				phone: d.phone,
				name: d.name,
				content,
			};
		});

		return [...ruta, ...templated, ...manualMessages];
	}, [
		dataClientsRuta,
		dataMessagesTemplates,
		manualMessages,
		templates,
		variableValues,
	]);

	const {
		recipients,
		isSubmitting,
		resultados,
		canSend,
		handleSendMessages,
		resetResultados,
		getRecipientCount,
		reset,
		cancel,
		completed,
		currentBatch,
		error,
		isPaused,
		isProcessing,
		pause,
		progress,
		resume,
		totalBatches,
		isCancelled,
		flyingMessages,
	} = useSendMessagesLogic({
		currentTemplate,
		dataClientesRuta: dataClientsRuta,
		dataMensajes: dataMessagesTemplates,
		selectedTemplate,
		variableValues,
	});

	const addClientToRuta = () => {
		if (!phone.trim()) return;

		const newClient: clientsInRuta & { __id: string } = {
			phoneNumber: phone,
			horaInicial: horaInicial || new Date().toISOString(),
			horaFinal: horaFinal || "",
			tipoMensaje: "confirmacion_de_pedido",
			__id: uuid.uuid,
		};

		setDataClientsRuta(prev => [...prev, newClient]);
		setPhone("");
		setHoraInicial("");
		setHoraFinal("");
	};

	const addManualMessage = () => {
		if (!content.trim() || !phone.trim()) return;

		const newMsg: Message = {
			id: uuid.uuid,
			phone,
			name,
			content,
		};

		setManualMessages(prev => [...prev, newMsg]);

		setPhone("");
		setName("");
		setContent("");
	};

	const addDataMessageTemplates = () => {
		if (!phone.trim() || !currentTemplate) return;

		const newMsg: dataUsar & { __id: string } = {
			name: name || "Sin nombre",
			phone,
			typeMessage: currentTemplate.name as dataUsar["typeMessage"],
			__id: uuid.uuid,
		};

		setDataMessagesTemplates(prev => [...prev, newMsg]);

		setContent("");
		setPhone("");
		setName("");
	};

	const removeFromOriginalSource = (id: string) => {
		// Elimina mensajes manuales por id
		setManualMessages(prev => prev.filter(m => m.id !== id));

		// Elimina dataUsar por __id si existe
		setDataMessagesTemplates(prev => prev.filter((d: any) => d.__id !== id));

		// Elimina clientsInRuta por __id si existe
		setDataClientsRuta(prev => prev.filter((c: any) => c.__id !== id));
	};

	const handleSendMessagesWrapper = async () => {
		const result = await handleSendMessages();

		if (result?.shouldCleanState) {
			resetResultados();
			setSelectedTemplate("");
			setVariableValues({});
			reset();
			setDataMessagesTemplates([])
			setManualMessages([]);
			setDataClientsRuta([]);
		}
	};

	const handleNewSend = () => {
		resetResultados();
		setSelectedTemplate("");
		setVariableValues({});
		reset();
		setManualMessages([]);
		setDataClientsRuta([]);
	};

	const handleTemplateChange = (templateId: string) => {
		if (templateId === "manual") {
			setSelectedTemplate("");
			setContent("");
			setVariableValues({});
		} else {
			setSelectedTemplate(templateId);
			setVariableValues({});
		}
	};

	const handleVariableChange = (varName: string, value: string) => {
		setVariableValues((prev) => ({ ...prev, [varName]: value }));
	};

	return (
		<article className="container mx-auto p-6 space-y-6">
			<MessagesFlyingCards messages={flyingMessages} />

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
								{!dataClientsRuta.length
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

				<section className="space-y-4">
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
		</article>
	);
};
