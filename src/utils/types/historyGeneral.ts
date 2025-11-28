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
	name: string;
	icon: string;
	color?: string;
	messagesSent: number;
	usageCount: number;
	status: "PENDING" | "APPROVED" | "REJECTED";
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
