import { ButtonEnvio } from "@/components/messages/buttonEnvio";
import { VariableEditor } from "@/components/messages/editor/variablesEditor";
import type { PreviewSendComponentProps } from "@/utils/types/messages";

export const PreviewSendComponent = ({ hasVars, vars, setVariableValues, variableValues, canSend, handleSendMessage, dataClientesRuta, isSubmitting, recipients, selectedTemplate }: PreviewSendComponentProps) => {
	return (
		<>
			<section className="space-y-4 lg:col-span-2">
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
			</section>
		</>
	)
}
