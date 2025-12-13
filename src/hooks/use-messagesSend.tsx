import { useBatchSender } from "@/hooks/common/use-senderBatch";
import { sendWhatsAppMessage } from "@/lib/providersMensajes/callApi/useApi";
import type { FlyingMessage } from "@/utils/types/flyingCards";
import type { ReplyFreeTextMessageRequest, SendFreeTextMessageRequest, SendMessageRequest } from "@/utils/types/providers/meta";
import { uuid } from "@/utils/uuid";
import { useState } from "react";
import { toast } from "sonner";

export interface UseSEndMessageProps {
	buildPayload: (recipient: string) => SendMessageRequest | SendFreeTextMessageRequest | ReplyFreeTextMessageRequest
	recipients: string[]
}

export const useSendMessage = ({ buildPayload, recipients }: UseSEndMessageProps) => {
	const [flyingMessages, setFlyingMessages] = useState<FlyingMessage[]>([])

	const { isCancelled, sendInBatches, reset, cancel, completed, currentBatch, error, isPaused, isProcessing, pause, progress, resume, totalBatches } = useBatchSender<string>(20);

	const createInitialFlyingMessages = (list: string[]) => {
		setFlyingMessages((prev) => [
			...prev,
			...list.map((phone) => ({
				id: uuid.uuid,
				recipient: phone,
			})),
		]);
	};

	const markFlyingSent = (recipient: string) => {
		setFlyingMessages((prev) =>
			prev.map((m) =>
				m.recipient === recipient && m.status === "sending"
					? { ...m, status: "sent" }
					: m
			)
		);
	};

	const markFlyingError = (recipient: string) => {
		setFlyingMessages((prev) =>
			prev.map((m) =>
				m.recipient === recipient && m.status === "sending"
					? { ...m, status: "error", errorCode: 500 }
					: m
			)
		);
	};

	const handleSendMessages = async () => {
		const recipientsList = recipients;
		if (recipientsList.length === 0) {
			toast.error("No hay destinatarios a quien enviar mensajes");
			return;
		}

		try {
			let successCount = 0;
			let errorCount = 0;

			await sendInBatches(
				recipientsList,
				async (batch) => {
					for (const phone of batch) {
						try {
							const payload = buildPayload(phone);
							//await sendWhatsAppMessage(payload);
							createInitialFlyingMessages(recipientsList);
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
			toast.error("Error crítico en el envío de mensajes");
			return { shouldCleanState: false };
		}
	}


}
