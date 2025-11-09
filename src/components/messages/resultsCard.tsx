import type { ApiResponse } from "@/utils/types/providers/meta";
import { AlertCircle, Check, CheckCircle2, Copy, XCircle } from "lucide-react";
import { useState } from "react";

interface Props {
	resultados: ApiResponse | null; // Permitir que `resultados` sea null
	onClose: () => void;
}

export const ResultsCard = ({ resultados, onClose }: Props) => {
	// Validar que `resultados` y `resultados.data` existan
	if (!resultados || !resultados.data) {
		return (
			<div className="bg-card border border-border rounded-lg p-6 text-center">
				<p className="text-muted-foreground">No hay datos disponibles</p>
			</div>
		);
	}

	const { data } = resultados;
	const { summary, results } = data;
	const [copiedId, setCopiedId] = useState<string | null>(null);

	const copyToClipboard = (text: string, id: string) => {
		navigator.clipboard.writeText(text);
		setCopiedId(id);
		setTimeout(() => setCopiedId(null), 2000);
	};

	const successRate =
		summary.total > 0
			? ((summary.success / summary.total) * 100).toFixed(1)
			: "0";

	return (
		<div className="bg-card border border-border rounded-lg p-6 space-y-6">
			{/* Header con resumen */}
			<div className="flex items-start justify-between">
				<div>
					<h3 className="text-lg font-semibold text-foreground mb-2">
						Resultados del Envío
					</h3>
					<div className="flex items-center gap-4 text-sm">
						<span className="flex items-center gap-1 text-green-600">
							<CheckCircle2 className="w-4 h-4" />
							{summary.success} exitosos
						</span>
						<span className="flex items-center gap-1 text-red-600">
							<XCircle className="w-4 h-4" />
							{summary.failed} fallidos
						</span>
						<span className="text-muted-foreground">
							Total: {summary.total}
						</span>
					</div>
				</div>
				<button
					onClick={onClose}
					className="text-muted-foreground hover:text-foreground"
				>
					✕
				</button>
			</div>

			{/* Barra de progreso */}
			<div className="space-y-2">
				<div className="flex justify-between text-sm">
					<span className="text-muted-foreground">Tasa de éxito</span>
					<span className="font-semibold text-foreground">{successRate}%</span>
				</div>
				<div className="w-full bg-muted rounded-full h-2">
					<div
						className="bg-green-600 h-2 rounded-full transition-all duration-500"
						style={{ width: `${successRate}%` }}
					/>
				</div>
			</div>

			{/* Lista de resultados */}
			<div className="space-y-2 max-h-96 overflow-y-auto">
				<h4 className="text-sm font-semibold text-foreground mb-2">
					Detalle de mensajes
				</h4>

				{results.map((result, index) => (
					<div
						key={index}
						className={`p-3 rounded-lg border ${result.status === "success"
							? "bg-green-50 border-green-200"
							: "bg-red-50 border-red-200"
							}`}
					>
						<div className="flex items-start justify-between gap-2">
							<div className="flex items-start gap-2 flex-1 min-w-0">
								{result.status === "success" ? (
									<CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
								) : (
									<XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
								)}
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-foreground truncate">
										{result.recipient}
									</p>
									{result.status === "success" && result.messageId && (
										<div className="flex items-center gap-1 mt-1">
											<code className="text-xs text-muted-foreground bg-muted px-1 rounded">
												{result.messageId.slice(0, 20)}...
											</code>
											<button
												onClick={() =>
													copyToClipboard(result.messageId!, result.messageId!)
												}
												className="p-1 hover:bg-muted rounded"
											>
												{copiedId === result.messageId ? (
													<Check className="w-3 h-3 text-green-600" />
												) : (
													<Copy className="w-3 h-3 text-muted-foreground" />
												)}
											</button>
										</div>
									)}
									{result.status === "error" && (
										<div className="mt-1 text-xs text-red-700">
											{result.errorCode && (
												<span className="font-mono">#{result.errorCode} - </span>
											)}
											{result.errorMessage}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Mensaje de advertencia si hay errores */}
			{summary.failed > 0 && (
				<div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
					<AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
					<div className="text-sm text-yellow-800">
						<p className="font-medium">Algunos mensajes no se pudieron enviar</p>
						<p className="text-xs mt-1 text-yellow-700">
							Revisa los números y códigos de error para más información
						</p>
					</div>
				</div>
			)}
		</div>
	);
};
