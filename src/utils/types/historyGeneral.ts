import type { LucideIcon } from "lucide-react";

export interface TrendChartProps {
	data: Array<{ date: string; messages: number }>;
}

interface DayData {
	date: string;
	count: number;
}

export interface CalendarHeatmapProps {
	data: DayData[];
}

export interface TemplateStatsCardProps {
	id: string
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

export interface MetricCardProps {
	title: string;
	value: string | number;
	icon: LucideIcon;
	trend?: {
		value: number;
		isPositive: boolean;
	};
	gradient?: "primary" | "warm";
}

export interface DayMessageHistory {
	id?: string; // Opcional para creación, requerido para actualización
	templateId: string;
	messagesSend: number; // Cantidad de mensajes enviados ese día
}

// Respuesta del servidor
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
