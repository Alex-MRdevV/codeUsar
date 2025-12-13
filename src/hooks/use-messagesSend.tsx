import { useBatchSender } from "@/hooks/common/use-senderBatch";
import { sendWhatsAppMessage } from "@/lib/providersMensajes/callApi/useApiSendMessages";
import type { FlyingMessage } from "@/utils/types/flyingCards";
import type { ApiResponse } from "@/utils/types/providers/meta";
import type { UseSendMessageProps } from "@/utils/types/send";
import { uuid } from "@/utils/uuid";
import { useState } from "react";

export const useSendMessage = ({ buildPayload, recipients, alcance, type }: UseSendMessageProps) => {
	const [flyingMessages, setFlyingMessages] = useState<FlyingMessage[]>([]);
	const [resultados, setResultados] = useState<ApiResponse | null>(null);

	const {
		isCancelled,
		sendInBatches,
		reset: resetBatch,
		cancel,
		completed,
		currentBatch,
		error,
		isPaused,
		isProcessing,
		pause,
		progress,
		resume,
		totalBatches
	} = useBatchSender<string>(20);

	const createFlyingMessage = (phone: string) => {
		setFlyingMessages((prev) => [
			...prev,
			{
				id: uuid.uuid,
				recipient: phone,
				status: "sending" as const,
			},
		]);
	};

	const markFlyingSent = (recipient: string) => {
		setFlyingMessages((prev) =>
			prev.map((m) =>
				m.recipient === recipient && m.status === "sending"
					? { ...m, status: "sent" as const }
					: m
			)
		);
	};

	const markFlyingError = (recipient: string) => {
		setFlyingMessages((prev) =>
			prev.map((m) =>
				m.recipient === recipient && m.status === "sending"
					? { ...m, status: "error" as const, errorCode: 500 }
					: m
			)
		);
	};

	const handleSendMessages = async () => {
		const recipientsList = recipients;
		if (recipientsList.length === 0) return { shouldCleanState: false };
		const results: ApiResponse[] = [];

		try {
			await sendInBatches(
				recipientsList,
				async (batch) => {
					for (const phone of batch) {
						createFlyingMessage(phone);
						try {
							const payload = buildPayload(phone);
							const [err, res] = await sendWhatsAppMessage(payload, alcance, type);
							if (res) results.push(res)
							markFlyingSent(phone);
						} catch (err) {
							markFlyingError(phone);
						}
					}
					await new Promise((r) => setTimeout(r, 500));
				}
			);

			setResultados({
				message: "Resumen de resultados",
				data: {
					results: results.flatMap(r => r.data?.results ?? []),
					summary: {
						success: results.reduce(
							(acc, r) => acc + (r.data?.summary.success ?? 0),
							0
						),
						failed: results.reduce(
							(acc, r) => acc + (r.data?.summary.failed ?? 0),
							0
						),
						total: results.reduce(
							(acc, r) => acc + (r.data?.summary.total ?? 0),
							0
						),
					},
				},
			});

			return { shouldCleanState: true };
		} catch (error) {
			return { shouldCleanState: false };
		}
	};

	const resetResultados = () => {
		setResultados(null);
	};

	const resetAll = () => {
		setFlyingMessages([]);
		setResultados(null);
		resetBatch();
	};

	return {
		flyingMessages,
		resultados,
		handleSendMessages,
		isCancelled,
		reset: resetAll,
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
		resetResultados
	};
};
