import { ButtonEnvio } from "@/components/messages/buttonEnvio";
import { CreateTemplateModal } from "@/components/messages/editor/modalTemplates";
import { PreviewCard } from "@/components/messages/editor/previewCard";
import { TemplateSelector } from "@/components/messages/editor/templaterSelector";
import { VariableEditor } from "@/components/messages/editor/variablesEditor";
import { Header } from "@/components/messages/header";
import { ResultsCard } from "@/components/messages/resultsCard";
import { useBatchSender } from "@/hooks/common/use-senderBatch";
import { sendWhatsAppMessage } from "@/lib/providersMensajes/callApi/useApi";
import { allDataClientesMensajes } from "@/utils/services/dataTransitoria/allData";
import { allDataRuta } from "@/utils/services/dataTransitoria/allDataRutas";
import { cleanData } from "@/utils/services/dataTransitoria/cleanData";
import { cleanDataRuta } from "@/utils/services/dataTransitoria/cleanDataRuta";
import type { clientsInRuta, dataUsar } from "@/utils/types/messages";
import type { SendMessageRequest } from "@/utils/types/providers/meta";
import type { Template } from "@/utils/types/templates";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ProgressComponent } from "../progress";

interface Props {
	templates: Template[];
}

export const SendMessages = ({ templates: initialTemplates }: Props) => {
	const [dataClientesRuta, setDataClientesRuta] = useState<clientsInRuta[] | null>(null);
	const [dataMensajes, setDataMensajes] = useState<dataUsar[] | null>(null);
	const [selectedTemplate, setSelectedTemplate] = useState<string>("");
	const [templates, setTemplates] = useState<Template[]>(initialTemplates);
	const [variableValues, setVariableValues] = useState<Record<string, string>>({});
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [resultados, setResultados] = useState<any | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		async function load() {
			try {
				const res = await allDataRuta();
				const resClientesMensajes = await allDataClientesMensajes();
				setDataClientesRuta(res);
				setDataMensajes(resClientesMensajes);
			} catch (err) {
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
		() => templates.find((t) => t.id === selectedTemplate) || null,
		[templates, selectedTemplate]
	);

	// Variables de la plantilla
	const vars = currentTemplate?.variables ?? null;
	const hasVars = Array.isArray(vars?.params) && vars.params.length > 0;

	const getMessageData = (phoneNumber: string) => {
		return dataMensajes?.find((msg) => msg.phone === phoneNumber) || null;
	};

	const getClientData = (phoneNumber: string) => {
		return dataClientesRuta?.find((client) => client.phoneNumber === phoneNumber) || null;
	};

	// Mapea plantillas a estados
	const getTargetStatusForTemplate = (templateName: string) => {
		switch (templateName) {
			case "pedidos_no_planeados":
				return "aplazado";
			case "pedidos_retrasados":
				return "Reasignados";
			case "confirmar_pedido":
				return "Para confirmar"
			case "confirmacion_de_pedido":
				return "enRuta";
			default:
				return "enRuta";
		}
	};

	// Recipients filtrados por plantilla
	const recipients = useMemo(() => {
		if (!currentTemplate) return [];

		const templateName =
			currentTemplate.metaTemplateName ??
			currentTemplate.name ??
			"";

		if (templateName === "confirmacion_de_pedido") {
			if (!Array.isArray(dataClientesRuta)) return [];

			return dataClientesRuta
				.filter((c) => c.tipoMensaje === "confirmacion_de_pedido")
				.map((c) => c.phoneNumber)
				.filter(Boolean);
		}

		// 🔥 Para TODAS las otras plantillas, usar dataMensajes
		if (!Array.isArray(dataMensajes)) return [];
		console.log(dataMensajes)

		return dataMensajes
			.filter((msg) => msg.typeMessage === templateName)
			.map((msg) => msg.phone)
			.filter(Boolean);
	}, [dataMensajes, dataClientesRuta, currentTemplate]);

	// Construye variables automáticas según plantilla y datos
	const buildTemplateVariables = (phoneNumber: string): Record<string, string> => {
		const messageData = getMessageData(phoneNumber);

		if (!messageData) return {};

		const nombreCliente = messageData?.name || "Cliente";

		switch (messageData?.typeMessage) {
			case "pedidos_no_planeados":
			case "pedidos_retrasados":
			case "confirmar_pedido":
				return { "1": nombreCliente };

			case "confirmacion_de_pedido":
				const clientData = getClientData(phoneNumber);
				return {
					"1": clientData?.horaInicial ?? "6:00 am",
					"2": clientData?.horaFinal ?? "6:30 am",
				};

			default:
				return {};
		}
	};

	// Construcción de array posicional
	const buildTemplateParamsArray = (phoneNumber: string): string[] => {
		const templateName = currentTemplate?.metaTemplateName ?? currentTemplate?.name ?? "";

		// 🔥 Para confirmacion_de_pedido, usar dataClientesRuta directamente
		if (templateName === "confirmacion_de_pedido") {
			const clientData = getClientData(phoneNumber);
			return [
				clientData?.horaInicial ?? "6:00 am",
				clientData?.horaFinal ?? "6:30 am",
			];
		}

		// Para las demás plantillas, usar dataMensajes
		const messageData = getMessageData(phoneNumber);
		if (!messageData) return [];

		const nombreCliente = messageData?.name || "Cliente";

		switch (messageData?.typeMessage) {
			case "pedidos_no_planeados":
			case "pedidos_retrasados":
			case "confirmar_pedido":
				return [nombreCliente];
			default:
				return [];
		}
	};

	const buildPayload = (recipient: string): SendMessageRequest => {
		if (!currentTemplate) throw new Error("No hay template seleccionado");

		const templateVars = currentTemplate.variables ?? {};
		const paramsList = Array.isArray((templateVars as any).params)
			? (templateVars as any).params
			: [];
		const rawFormat = (templateVars as any).format;
		const isPositional =
			rawFormat?.toUpperCase?.() === "POSITIONAL" ||
			rawFormat === "positional";

		console.log(currentTemplate.metaTemplateName)

		const templateNameToUse =
			currentTemplate.metaTemplateName ?? currentTemplate.name;

		console.log(templateNameToUse)

		const shouldUseVariableValues =
			templateNameToUse !== "confirmacion_de_pedido" &&
			Object.keys(variableValues ?? {}).length > 0;

		let formattedParams: string[];

		if (isPositional) {
			if (shouldUseVariableValues) {
				formattedParams = [...paramsList]
					.sort((a, b) => Number(a.name) - Number(b.name))
					.map((p) => variableValues[p.name] || "");
			} else {
				const params = buildTemplateParamsArray(recipient);
				formattedParams = params;
			}
		} else {
			formattedParams = shouldUseVariableValues
				? Object.values(variableValues)
				: Object.values(buildTemplateVariables(recipient));
		}

		const needsHeaderParams = templateNameToUse === "confirmar_pedido";
		console.log(needsHeaderParams)

		return {
			templateId: currentTemplate.id,
			messageType: "template",
			templateName: templateNameToUse,
			templateLanguage: currentTemplate.language || "es_CO",
			parameterFormat: "positional",
			recipients: [
				{
					phone: recipient,
					params: formattedParams,
				},
			],
			templateParamsPositional: formattedParams,
			...(needsHeaderParams && { headerParams: formattedParams }),
		};
	};

	// Envío en batches
	const handleSendMessages = async () => {
		if (!currentTemplate) {
			toast.error("Selecciona una plantilla");
			return;
		}

		const recipientsList = recipients;
		if (recipientsList.length === 0) {
			toast.error("No hay destinatarios para esta plantilla");
			return;
		}

		setIsSubmitting(true);
		setResultados(null);

		try {
			let successCount = 0;
			let errorCount = 0;

			await sendInBatches(
				recipientsList,
				async (batch) => {
					for (const phone of batch) {
						try {
							const payload = buildPayload(phone);
							console.log(payload)
							await sendWhatsAppMessage(payload);
							successCount++;
						} catch (err) {
							errorCount++;
						}
					}
					await new Promise((r) => setTimeout(r, 500));
				},
				1000
			);

			if (isCancelled) {
				setResultados({ ok: false, error: "Envío cancelado por el usuario" });
				toast.warning(`Envío cancelado. Enviados: ${successCount}, Fallidos: ${errorCount}`);
			} else if (errorCount > 0 && successCount > 0) {
				setResultados({ ok: true, enviados: successCount, fallidos: errorCount });
				toast.warning(`Envío parcial: ${successCount} exitosos, ${errorCount} fallidos`);
			} else if (errorCount > 0) {
				setResultados({ ok: false, error: `Todos los envíos fallaron (${errorCount})` });
				toast.error("Ocurrió un error, no se pudo enviar ningún mensaje");
			} else {
				setResultados({ ok: true, enviados: successCount });
				toast.success(`✓ ${successCount} mensajes enviados exitosamente`);
			}

			if (errorCount === 0 && !isCancelled) {
				try {
					// Limpiar datos en paralelo
					await Promise.all([
						cleanData(),
						cleanDataRuta()
					]);

					toast.success("✓ Datos limpiados correctamente");
				} catch (cleanError) {
					toast.warning("Mensajes enviados, pero hubo un error al limpiar los datos");
				}

				// Limpiar estados locales
				setDataClientesRuta(null);
				setDataMensajes(null);
				setSelectedTemplate("");
				setVariableValues({});
				reset();
			}

		} catch (err: any) {
			setResultados({ ok: false, error: err?.message || String(err) });
			toast.error("Error crítico en el envío de mensajes");
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
		setDataClientesRuta(null);
		setDataMensajes(null);
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
		if (!dataMensajes) return false;

		if (recipients.length === 0) return false;

		if (currentTemplate?.variables && Object.keys(variableValues).length > 0) {
			return currentTemplate.variables.params.every(
				(param: any) => (variableValues[param.name] ?? "").trim().length > 0
			);
		}

		return true;
	};

	const getRecipientCount = () => recipients.length;

	return (
		<article className="p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 w-full max-w-[1800px] mx-auto">
			<Header setShowCreateModal={setShowCreateModal} />

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

							{/* ✅ CORRECCIÓN 3: Cambio de 'clientes' a 'dataMensajes' */}
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
								<div className="bg-card border border-border rounded-lg p-4">
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
