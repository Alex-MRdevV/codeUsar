export type TemplateStatus = "PENDING" | "APPROVED" | "REJECTED";
export type HeaderType = "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT" | "NONE";
export type ButtonType = "QUICK_REPLY" | "URL" | "PHONE_NUMBER";

/**
 * Datos agregados por fecha para el heatmap
 */
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

/**
 * Datos para gráficos de tendencia temporal
 */
export interface TrendDataPoint {
	date: string; // ISO format: YYYY-MM-DD
	messages: number;
}

/**
 * Métrica de cambio/tendencia
 */
export interface TrendMetric {
	value: number; // Porcentaje de cambio
	isPositive: boolean;
}

/**
 * Estadísticas de un template específico
 */
export interface TemplateStats {
	id: string;
	name: string;
	icon: string;
	color: string;
	messagesSent: number;
	status: TemplateStatus;
}

/**
 * Props para cards de métricas generales
 */
export interface MetricCardProps {
	title: string;
	value: string | number;
	icon: React.ComponentType<{ className?: string }>; // LucideIcon
	trend?: TrendMetric;
	gradient?: "primary" | "warm";
}

/**
 * Props para la sección completa de métricas
 */
export interface MetricCardSectionProps {
	templatesData: TemplateStats[];
	totalMessages: number;
	totalTrend?: TrendMetric;
	heatmapData?: HeatmapDataPoint[];
	trendData?: TrendDataPoint[];
}

/**
 * Props para el gráfico de tendencias
 */
export interface TrendChartProps {
	data: TrendDataPoint[];
	showGrid?: boolean;
	height?: number;
}

/**
 * Props para la sección de tooltip del heatmap
 */

export interface HeatmapTooltipSectionProps {
	getCountForDate: (date: Date) => number;
	days: Date[];
	getIntensity: (count: number) => string;
}
