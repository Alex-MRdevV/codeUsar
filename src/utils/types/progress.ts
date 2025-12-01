import {
	AlertCircle,
	CheckCircle2,
	Loader2,
	Package,
	Pause,
	XCircle,
} from "lucide-react";

export interface BatchProgressProps {
	progress: number;
	isProcessing: boolean;
	completed: boolean;
	currentBatch: number;
	totalBatches: number;
	error: string | null;
	isCancelled: boolean;
	isPaused?: boolean;
	onCancel?: () => void;
	onPause?: () => void;
	onResume?: () => void;
	onReset?: () => void;
	title?: string;
	className?: string;
	compact?: boolean;
	showCancelButton?: boolean;
}

export interface BatchProgressVersionCompact {
	status: "processing" | "error" | "cancelled" | "completed" | "idle";
	completed: boolean;
	error: string | null;
	isCancelled: boolean;
	isProcessing: boolean;
	progress: number;
	className?: string;
	onCancel?: () => void;
	onReset?: () => void;
	isPaused?: boolean;
	onPause?: () => void;
	onResume?: () => void;
	showCancelButton?: boolean;
}

export interface BatchProgressVersionCompleta {
	status: "processing" | "error" | "cancelled" | "completed" | "idle";
	completed: boolean;
	error: string | null;
	isCancelled: boolean;
	isProcessing: boolean;
	progress: number;
	className?: string;
	onCancel?: () => void;
	onReset?: () => void;
	isPaused?: boolean;
	onPause?: () => void;
	onResume?: () => void;
	showCancelButton?: boolean;
	title?: string;
	currentBatch: number;
	totalBatches: number;
}

export const statusConfig = {
	idle: {
		icon: Package,
		color: "text-muted-foreground",
		bgColor: "bg-muted",
		progressColor: "bg-muted-foreground",
		label: "Listo para procesar",
	},
	processing: {
		icon: Loader2,
		color: "text-chart-1",
		bgColor: "bg-chart-1/10",
		progressColor: "bg-chart-1",
		label: "Procesando...",
	},
	paused: {
		icon: Pause,
		color: "text-sky-500 dark:text-sky-400",
		bgColor: "bg-sky-500/10 dark:bg-sky-400/10",
		progressColor: "bg-sky-500 dark:bg-sky-400",
		label: "En pausa",
	},
	completed: {
		icon: CheckCircle2,
		color: "text-emerald-500 dark:text-emerald-400",
		bgColor: "bg-emerald-500/10 dark:bg-emerald-400/10",
		progressColor: "bg-emerald-500 dark:bg-emerald-400",
		label: "¡Completado!",
	},
	cancelled: {
		icon: XCircle,
		color: "text-amber-500 dark:text-amber-400",
		bgColor: "bg-amber-500/10 dark:bg-amber-400/10",
		progressColor: "bg-amber-500 dark:bg-amber-400",
		label: "Cancelado",
	},
	error: {
		icon: AlertCircle,
		color: "text-destructive",
		bgColor: "bg-destructive/10",
		progressColor: "bg-destructive",
		label: "Error",
	},
};
