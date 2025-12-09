import { CheckCircle, Clock, XCircle, type LucideProps } from "lucide-react";
import type {
	Dispatch,
	ForwardRefExoticComponent,
	RefAttributes,
	SetStateAction,
} from "react";
import type { TemplateForMetrics } from "./templates";

export interface TrendChartProps {
	data: Array<{ date: string; messages: number }>;
}

export interface TrendDataPoint {
	date: string; // ISO format: YYYY-MM-DD
	messages: number;
}

export interface TrendMetric {
	value: number; // Porcentaje de cambio
	isPositive: boolean;
}

export interface MetricCardProps {
	title: string;
	value: string | number;
	icon: React.ComponentType<{ className?: string }>; // LucideIcon
	trend?: TrendMetric;
	gradient?: "primary" | "warm";
}

export interface TrendChartProps {
	data: TrendDataPoint[];
	showGrid?: boolean;
	height?: number;
}

export interface HeatmapDataPoint {
	date: string; // ISO format: YYYY-MM-DD
	count: number; // Total de mensajes ese día
	templates: Array<{
		id: string;
		name: string;
		color: string;
		messagesSent: number;
	}>;
	uniqueNumbers: number; // Números únicos contactados
}

export interface MetricCardSectionProps {
	templatesData: TemplateForMetrics[];
	totalMessages: number;
	totalTrend?: TrendMetric;
	heatmapData?: HeatmapDataPoint[];
	trendData?: TrendDataPoint[];
	uniqueNumbers: number;
}

interface TemplateDetail {
	id: string;
	name: string;
	color: string;
	messagesSent: number;
}

export interface DayData {
	date: string;
	count: number;
	templates?: TemplateDetail[];
	uniqueNumbers?: number;
}

export interface HeatmapTooltipSectionProps {
	getCountForDate: (date: Date) => number;
	days: Date[];
	getIntensity: (count: number) => string;
	getDataForDate: (date: Date) => DayData | undefined;
	setSelectedDay: Dispatch<SetStateAction<DayData | null>>;
}

export interface CalendarHeatmapProps {
	data: DayData[];
}

export interface TemplateStatsCardProps {
	id: string;
	name: string;
	icon: string;
	color?: string;
	messagesSent: number;
	status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface HistoryStatsParams {
	startDate?: string; // Fecha inicio (formato: YYYY-MM-DD)
	endDate?: string; // Fecha fin (formato: YYYY-MM-DD)
	templateId?: string; // Filtrar por plantilla específica
	limit?: number; // Limitar cantidad de días a mostrar
}

export interface DayMessageHistory {
	id?: string; // Opcional para creación, requerido para actualización
	templateId: string;
	messagesSend: number; // Cantidad de mensajes enviados ese día
}

export interface DayHistoryResponse {
	success: boolean;
	message: string;
	data?: DayMessageHistory;
}

export interface DailyMessageStats {
	date: string; // Formato: "2024-11-30" o "30/11/2024"
	totalMessages: number; // Total de mensajes enviados ese día
	details?: Array<{
		templateId: string;
		templateName: string;
		messagesSend: number;
	}>; // Opcional: desglose por plantilla
}

export interface HistoryStatsResponse {
	success: boolean;
	message: string;
	data: {
		templates: TemplateStatsCardProps[]; // Stats de todas las plantillas
		dailyStats: DailyMessageStats[]; // Mensajes por día (ordenado por fecha desc)
		summary: {
			totalTemplates: number;
			totalMessages: number; // Total acumulado de todos los días
			totalDays: number; // Días con registro
			averagePerDay: number; // Promedio de mensajes por día
		};
	};
}

export const statusConfig = {
	APPROVED: {
		icon: CheckCircle,
		label: "Aprobada",
		className:
			"bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30",
	},
	PENDING: {
		icon: Clock,
		label: "Pendiente",
		className:
			"bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
	},
	REJECTED: {
		icon: XCircle,
		label: "Rechazada",
		className: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
	},
};

export interface TemplatesOverviewAdminProps {
	templates: TemplateStatsCardProps[];
}

export interface MessagesChartsAdminProps {
	data: {
		date: string;
		enviados: number;
		entregados: number;
	}[];
}

export interface DeliveryStatusChartsProps {
	data: {
		name: "Entregados" | "Fallidos" | "Programados";
		value: number;
		color: "--color-primary" | "--color-error" | "--color-purple";
	}[];
}

export interface RecentACtivitiesProps {
	activities: {
		id: string;
		phone: string;
		template: string;
		status: string;
		time: string;
	}[];
}

export interface StatsCardsUserProps {
	stats: {
		title: string;
		value: string;
		change: string;
		trend: string;
		icon: ForwardRefExoticComponent<
			Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
		>;
		description: string;
		colorClass: string;
	}[];
}

export interface TemplateBreakdown {
	id: string;
	name: string;
	color: string;
	messagesSent: number;
	percentage: number;
}

export interface DayStats {
	date: string;
	totalMessages: number;
	uniqueNumbers: number;
	templates: TemplateBreakdown[];
}

export interface DayStatsPanelProps {
	getDayStats: (date: Date) => DayStats | null;
}

export interface HeaderPanelProps {
	goToPreviousDay: () => void;
	setIsCalendarOpen: Dispatch<SetStateAction<boolean>>;
	isCalendarOpen: boolean;
	goToNextDay: () => void;
	handleDateSelect: (date: Date | undefined) => void;
	isToday: boolean;
	selectedDate: Date;
}

export interface TemplatePanelProps {
	templates: TemplateBreakdown[];
}
