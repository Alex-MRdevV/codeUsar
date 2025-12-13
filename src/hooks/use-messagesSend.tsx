import { useBatchSender } from "@/hooks/common/use-senderBatch";
import { sendWhatsAppMessage } from "@/lib/providersMensajes/callApi/useApi";
import type { FlyingMessage } from "@/utils/types/flyingCards";
import type { UseSendMessageProps } from "@/utils/types/send";
import { uuid } from "@/utils/uuid";
import { useState } from "react";

export const useSendMessage = ({ buildPayload, recipients }: UseSendMessageProps) => {
	const [flyingMessages, setFlyingMessages] = useState<FlyingMessage[]>([])
	const { isCancelled, sendInBatches, reset, cancel, completed, currentBatch, error, isPaused, isProcessing, pause, progress, resume, totalBatches } = useBatchSender<string>(20);

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
		if (recipientsList.length === 0) return;

		try {
			let successCount = 0;
			let errorCount = 0;

			await sendInBatches(
				recipientsList,
				async (batch) => {
					for (const phone of batch) {
						createFlyingMessage(phone);
						try {
							const payload = buildPayload(phone);
							//await sendWhatsAppMessage(payload);
							successCount++;
							markFlyingSent(phone);
						} catch (err) {
							errorCount++;
							markFlyingError(phone);
						}
					}
					await new Promise((r) => setTimeout(r, 500));
				}
			);
		} catch (error) {
			return { shouldCleanState: false };
		}
	}

	

	return {
		flyingMessages,
		handleSendMessages,
		isCancelled,
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
	}
}
