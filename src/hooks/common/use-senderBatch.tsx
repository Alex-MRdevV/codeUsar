import { useCallback, useRef, useState } from "react";

export function useBatchSender<T>(batchSize: number) {
	const [progress, setProgress] = useState(0);
	const [isProcessing, setIsProcessing] = useState(false);
	const [completed, setCompleted] = useState(false);
	const [currentBatch, setCurrentBatch] = useState(0);
	const [totalBatches, setTotalBatches] = useState(0);
	const [error, setError] = useState<null | string>(null);
	const [isCancelled, setIsCancelled] = useState(false);
	const [isPaused, setIsPaused] = useState(false);

	// control interno
	const cancelRef = useRef(false);
	const pauseRef = useRef(false);

	const waitForResume = useCallback(() => {
		return new Promise<void>(resolve => {
			const interval = setInterval(() => {
				if (!pauseRef.current) {
					clearInterval(interval);
					resolve();
				}
			}, 200);
		});
	}, []);

	const sendInBatches = useCallback(
		async (
			items: T[],
			sendFunction: (batch: T[]) => Promise<void>,
			delayMs: number = 500
		) => {
			setIsProcessing(true);
			setCompleted(false);
			setProgress(0);
			setError(null);
			setIsCancelled(false);

			cancelRef.current = false;
			pauseRef.current = false;
			const batches = Math.ceil(items.length / batchSize);
			setTotalBatches(batches);

			try {
				for (let i = 0; i < items.length; i += batchSize) {
					// pausa
					while (pauseRef.current) {
						await waitForResume();
					}

					if (cancelRef.current) {
						setIsCancelled(true);
						break;
					}

					const batch = items.slice(i, i + batchSize);
					const batchNumber = Math.floor(i / batchSize) + 1;
					setCurrentBatch(batchNumber);
					await sendFunction(batch);

					// actualiza progreso
					const progressPercent = Math.min(
						((i + batch.length) / items.length) * 100,
						100
					);
					setProgress(progressPercent);

					if (i + batchSize < items.length) {
						await new Promise(resolve => setTimeout(resolve, delayMs));
					}
				}
			} catch (err: any) {
				setError(err?.message || "Error procesando los datos");
			} finally {
				setIsProcessing(false);
				setCompleted(!cancelRef.current && !pauseRef.current && !error);
			}
		},
		[batchSize, waitForResume]
	);

	const cancel = useCallback(() => {
		cancelRef.current = true;
		setIsPaused(false);
		pauseRef.current = false;
	}, []);

	const pause = useCallback(() => {
		pauseRef.current = true;
		setIsPaused(true);
	}, []);

	const resume = useCallback(() => {
		pauseRef.current = false;
		setIsPaused(false);
	}, []);

	const reset = useCallback(() => {
		setProgress(0);
		setIsProcessing(false);
		setCompleted(false);
		setCurrentBatch(0);
		setTotalBatches(0);
		setError(null);
		setIsCancelled(false);
		setIsPaused(false);

		cancelRef.current = false;
		pauseRef.current = false;
	}, []);

	return {
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
		reset,
	};
}
