import { useCallback, useState } from 'react';

export function useBatchSender<T>(batchSize: number) {
	const [progress, setProgress] = useState(0);
	const [isProcessing, setIsProcessing] = useState(false);
	const [completed, setCompleted] = useState(false);
	const [currentBatch, setCurrentBatch] = useState(0);
	const [totalBatches, setTotalBatches] = useState(0);

	const sendInBatches = useCallback(
		async (
			items: T[],
			sendFunction: (batch: T[]) => Promise<void>,
			delayMs: number = 500
		) => {
			setIsProcessing(true);
			setCompleted(false);
			setProgress(0);

			const batches = Math.ceil(items.length / batchSize);
			setTotalBatches(batches);

			for (let i = 0; i < items.length; i += batchSize) {
				const batch = items.slice(i, i + batchSize);
				const batchNumber = Math.floor(i / batchSize) + 1;

				setCurrentBatch(batchNumber);

				// Simular envío (reemplazar con tu función real)
				await sendFunction(batch);

				const progressPercent = Math.min(
					((i + batch.length) / items.length) * 100,
					100
				);
				setProgress(progressPercent);

				// Delay entre lotes
				if (i + batchSize < items.length) {
					await new Promise(resolve => setTimeout(resolve, delayMs));
				}
			}

			setCompleted(true);
			setIsProcessing(false);
		},
		[batchSize]
	);

	const reset = useCallback(() => {
		setProgress(0);
		setIsProcessing(false);
		setCompleted(false);
		setCurrentBatch(0);
		setTotalBatches(0);
	}, []);

	return {
		progress,
		isProcessing,
		completed,
		currentBatch,
		totalBatches,
		sendInBatches,
		reset,
	};
}
