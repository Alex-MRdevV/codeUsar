import { CreateTemplateModal } from "@/components/messages/editor/modalTemplates";
import { Header } from "@/components/messages/header";
import { ResultsCard } from "@/components/messages/resultsCard";
import { SendForm } from "@/components/messages/send/variablesSection";
import type { clientsInRuta, SendViewComponentProps } from "@/utils/types/messages";

export const InfoAlert = ({ recipientCount, status }: { recipientCount: number; status: string }) => (
	<div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs">
		<p className="text-blue-600">
			📊 Se enviarán mensajes a <strong className="font-semibold">{recipientCount}</strong> clientes en estado{" "}
			<strong className="font-semibold">{status.toUpperCase()}</strong>
		</p>
	</div>
);

export const ValidationWarning = ({
	dataClientesRuta,
	recipients,
	selectedTemplate
}: {
	dataClientesRuta: clientsInRuta[];
	recipients: string[];
	selectedTemplate: string;
}) => {
	if (!selectedTemplate) return null;

	const getWarningMessage = () => {
		if (!dataClientesRuta) {
			return "⚠️ No hay datos cargados. Carga un archivo primero.";
		}
		if (recipients.length === 0) {
			return "⚠️ No hay clientes en el estado correspondiente para esta plantilla.";
		}
		return "⚠️ Completa todas las variables requeridas antes de enviar";
	};

	return (
		<div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
			<p className="text-xs text-yellow-600">{getWarningMessage()}</p>
		</div>
	);
};

export const ResultsView = ({ resultados, onNewSend }: { resultados: any; onNewSend: () => void }) => (
	<div className="space-y-4">
		<ResultsCard resultados={resultados} onClose={onNewSend} />
		<button
			onClick={onNewSend}
			className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-semibold"
		>
			Enviar nuevos mensajes
		</button>
	</div>
);

export const SendViewComponent = (props: SendViewComponentProps) => {
	const {
		setShowCreateModal,
		resultados,
		handleNewSend,
		showCreateModal,
		handleCreateTemplate,
		...formProps
	} = props;

	return (
		<article className="p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 w-full max-w-[1800px] mx-auto">
			<Header setShowCreateModal={setShowCreateModal} />

			<section className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="col-span-1 md:col-span-2 space-y-4">
					{resultados ? (
						<ResultsView resultados={resultados} onNewSend={handleNewSend} />
					) : (
						<SendForm {...formProps} />
					)}
				</div>
			</section>

			{showCreateModal && (
				<CreateTemplateModal onClose={() => setShowCreateModal(false)} onSuccess={handleCreateTemplate} />
			)}
		</article>
	);
};
