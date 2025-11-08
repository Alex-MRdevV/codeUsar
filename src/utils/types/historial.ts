export interface StatCardProps {
	label: string;
	value: string;
	icon: string;
	trend?: string;
	trendColor?: string;
	description?: string;
}

export interface TemplateCardProps {
	template: {
		id: number;
		name: string;
		icon: string;
		count: number;
		color: string;
	};
	percentage: number;
}

export interface templates {
	data: {
		id: string;
		name: string;
		icon: string;
		count: number;
		color: string;
	}[];
}

interface StatCardConfig {
	label: string;
	value: string | number;
	icon: string;
	trend?: string;
	description?: string;
	trendColor?: string;
}

export interface StatsOverviewProps {
	data: Record<string, any>;
	config: StatCardConfig[];
}

interface Template {
  id: number;
  name: string;
  icon: string;
  count: number;
  color: string;
}

export interface HistorialAplicadoProps {
  templates: Template[];
  statsConfig: StatCardConfig[];
}
