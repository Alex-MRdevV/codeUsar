import { ButtonEnvio } from "@/components/messages/buttonEnvio";
import { CreateTemplateModal } from "@/components/messages/editor/modalTemplates";
import { PreviewCard } from "@/components/messages/editor/previewCard";
import { TemplateSelector } from "@/components/messages/editor/templaterSelector";
import { VariableEditor } from "@/components/messages/editor/variablesEditor";
import { ResultsCard } from "@/components/messages/resultsCard";
import { useBatchSender } from "@/hooks/common/use-senderBatch";
import { sendWhatsAppMessage } from "@/lib/providersMensajes/callApi/useApi";
import { allDataTransitoria } from "@/utils/services/dataTransitoria/allData";
import type { PersistedBavariaNow, PersistedConsolidado } from "@/utils/types/messages";
import type { SendMessageRequest } from "@/utils/types/providers/meta";
import type { Template } from "@/utils/types/templates";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ProgressComponent } from "../progress";
import { Header } from "./header";


interface Props {
	templates: Template[];
}

export const SendMessages = ({ templates: initialTemplates }: Props) => {
	const [dataConsolidado, setDataConsolidado] = useState<PersistedConsolidado | null>(null);
	const [dataBavariaNow, setDataBavariaNow] = useState<PersistedBavariaNow | null>(null);
	const [selectedTemplate, setSelectedTemplate] = useState<string>("");
	const [templates, setTemplates] = useState<Template[]>(initialTemplates);
	const [recipients, setRecipients] = useState<string[]>([]);
	const [variableValues, setVariableValues] = useState<Record<string, string>>({});
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [resultados, setResultados] = useState<any | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		async function load() {
			try {
				const res = await allDataTransitoria();
				setDataConsolidado(res.dataConsolidado);
				setDataBavariaNow(res.dataBavariaNow ?? null);
			} catch (err) {
				console.error("Error cargando data transitoria", err);
				toast.error("No se pudo cargar la data transitoria");
			}
		}

		load();
	}, []);

	const {
		progress,
		isProcessing,
		completed,
		currentBatch,
		totalBatches,
		error,
		isCancelled,
		isPaused,
		sendInBatches,
		cancel,
		pause,
		resume,
		reset
	} = useBatchSender<string>(10);

	const currentTemplate = useMemo(
		() => templates.find((t) => t.id === selectedTemplate),
		[templates, selectedTemplate]
	);

	const vars = currentTemplate?.variables;
	const hasVars = !!(vars && Array.isArray(vars.params) && vars.params.length > 0);

	// Mapea plantillas a estados
	const getTargetStatusForTemplate = (templateName: string) => {
		switch (templateName) {
			case "pedidos_no_planeados":
				return "aplazado" as const;
			case "pedidos_retrasados":
				return "segundoViaje" as const;
			case "confirmar_pedido":
			case "confirmacion_de_pedido":
				return "enRuta" as const;
			default:
				return "enRuta" as const;
		}
	};

	// Construye recipients desde dataConsolidado y plantilla seleccionada
	const buildRecipients = (): string[] => {
		if (!dataConsolidado || !currentTemplate) return [];
		const status = getTargetStatusForTemplate(currentTemplate.metaTemplateName || "");
		const list = dataConsolidado.byStatus?.[status] ?? [];
		return list.map((c) => c.phoneNumber).filter(Boolean);
	};

	// Actualiza recipients cuando cambia plantilla o la data
	useEffect(() => {
		const list = buildRecipients();
		setRecipients(list);
	}, [dataConsolidado, currentTemplate]);

	// Buscar cliente reducido por teléfono
	const getClientData = (phoneNumber: string) => {
		if (!dataConsolidado) return null;
		const all = [
			...(dataConsolidado.byStatus.enRuta ?? []),
			...(dataConsolidado.byStatus.segundoViaje ?? []),
			...(dataConsolidado.byStatus.aplazado ?? [])
		];
		return all.find((c) => c.phoneNumber === phoneNumber) ?? null;
	};

	// Obtener bavaria reducido por clienteId
	const getBavariaNowData = (clienteId?: string) => {
		if (!clienteId || !dataBavariaNow?.groupedOrders) return null;
		return dataBavariaNow.groupedOrders[clienteId] ?? null;
	};

	// Construye variables automáticas según plantilla y cliente
	const buildTemplateVariables = (phoneNumber: string): Record<string, string> => {
		const clientData = getClientData(phoneNumber);
		if (!clientData) return {};

		const bavariaData = getBavariaNowData(clientData.clienteId);
		const nombreCliente =
			bavariaData?.clienteInfo?.nombre || clientData.nameEstablecimiento || "Cliente";

		switch (currentTemplate?.metaTemplateName) {
			case "pedidos_no_planeados":
			case "pedidos_retrasados":
			case "confirmar_pedido":
				return { "1": nombreCliente };

			case "confirmacion_de_pedido":
				return {
					"1": clientData.horaInicial ?? "6:00 am",
					"2": clientData.horaFinal ?? "6:30 am"
				};

			default:
				return {};
		}
	};

	// Construye payload para un destinatario
	const buildPayload = (recipient: string): SendMessageRequest => {
		if (!currentTemplate) throw new Error("No template selected");

		const paramFormatRaw = currentTemplate?.variables?.format;
		const isPositional =
			(typeof paramFormatRaw === "string" && paramFormatRaw.toUpperCase() === "POSITIONAL") ||
			paramFormatRaw === "positional";

		const finalVariableValues =
			Object.keys(variableValues ?? {}).length > 0 ? variableValues : buildTemplateVariables(recipient);

		const payload: SendMessageRequest = {
			templateId: currentTemplate.id,
			recipients: [recipient],
			messageType: "template",
			templateName: currentTemplate.name,
			templateLanguage: currentTemplate.language || "es",
			parameterFormat: isPositional ? "positional" : "named",
			templateParamsPositional: isPositional ? Object.values(finalVariableValues) : undefined,
			templateParams: !isPositional ? finalVariableValues : undefined
		};

		return payload;
	};

	// Envío en batches
	const handleSendMessages = async () => {
		if (!currentTemplate) {
			toast.error("Selecciona una plantilla");
			return;
		}

		const recipientsList = buildRecipients();
		if (recipientsList.length === 0) {
			toast.error("No hay destinatarios para esta plantilla");
			return;
		}

		setIsSubmitting(true);
		setResultados(null);

		try {
			await sendInBatches(
				recipientsList,
				async (batch) => {
					for (const phone of batch) {
						const payload = buildPayload(phone);
						await sendWhatsAppMessage(payload);
					}
					// pequeño delay entre batches
					await new Promise((r) => setTimeout(r, 500));
				},
				1000 // intervalo entre batches (ajusta si quieres)
			);

			// Resultado exitoso
			const enviados = recipientsList.length;
			setResultados({ ok: true, enviados });
			toast.success(`Mensajes enviados: ${enviados}`);

			setDataConsolidado(null);
			setDataBavariaNow(null);

			setRecipients([]);
			setSelectedTemplate("");
			setVariableValues({});
			reset();

		} catch (err: any) {
			console.error("Error enviando mensajes", err);
			setResultados({ ok: false, error: err?.message || String(err) });
			toast.error("Error al enviar algunos mensajes");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSendMessage = async () => {
		if (!currentTemplate) return;
		await handleSendMessages();
	};

	const handleCreateTemplate = async (newTemplate: Template) => {
		setTemplates((prev) => [...prev, newTemplate]);
		setShowCreateModal(false);
	};

	const resetResultados = () => {
		setResultados(null);
	};

	const handleNewSend = () => {
		resetResultados();
		setDataConsolidado(null);
		setDataBavariaNow(null);
		setRecipients([]);
		setSelectedTemplate("");
		setVariableValues({});
		reset();
	};

	const handleTemplateChange = (templateId: string) => {
		setSelectedTemplate(templateId);
		setVariableValues({});
	};

	const canSend = (): boolean => {
		if (!selectedTemplate || isSubmitting) return false;
		if (!dataConsolidado) return false;

		const targetRecipients = buildRecipients();
		if (targetRecipients.length === 0) return false;

		// Si hay variables manuales, validarlas
		if (currentTemplate?.variables && Object.keys(variableValues).length > 0) {
			return currentTemplate.variables.params.every(
				(param: any) => (variableValues[param.name] ?? "").trim().length > 0
			);
		}

		return true;
	};

	const getRecipientCount = () => {
		if (!currentTemplate || !dataConsolidado) return 0;
		const status = getTargetStatusForTemplate(currentTemplate.metaTemplateName || "");
		return (dataConsolidado.byStatus?.[status] ?? []).length;
	};

	return (
		<article className="p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 w-full max-w-[1800px] mx-auto">
			<Header setShowCreateModal={setShowCreateModal} />

			<div
				className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-4
      "
			>
				<div className="col-span-1 md:col-span-2 space-y-4">
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

							{selectedTemplate && dataConsolidado && (
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
								<div className="bg-card border border-border rounded-lg p-4">
									<div className="mb-3 p-3 bg-green-500/10 border border-green-500/20 rounded">
										<p className="text-xs text-green-600">
											✨ Las variables se completarán automáticamente con los datos de cada cliente.
											Puedes sobrescribirlas manualmente si lo necesitas.
										</p>
									</div>
									<VariableEditor
										variables={vars!}
										values={variableValues}
										onChange={setVariableValues}
									/>
								</div>
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
										{!dataConsolidado
											? "⚠️ No hay datos cargados. Carga un archivo primero."
											: getRecipientCount() === 0
												? "⚠️ No hay clientes en el estado correspondiente para esta plantilla."
												: "⚠️ Completa todas las variables requeridas antes de enviar"}
									</p>
								</div>
							)}
						</>
					)}
				</div>

				<div className="col-span-1 space-y-4">
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
							<PreviewCard
								template={currentTemplate}
								variableValues={
									Object.keys(variableValues).length > 0
										? variableValues
										: buildTemplateVariables(recipients[0] || "")
								}
								recipients={recipients}
							/>
						</div>
					)}
				</div>
			</div>

			{showCreateModal && (
				<CreateTemplateModal
					onClose={() => setShowCreateModal(false)}
					onSuccess={handleCreateTemplate}
				/>
			)}
		</article>
	);
};
