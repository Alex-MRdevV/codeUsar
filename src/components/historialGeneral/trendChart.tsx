import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TrendChartProps } from "@/utils/types/historyGeneral";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const TrendChart = ({ data }: TrendChartProps) => {
	return (
		<Card className="shadow-elegant border-border/50">
			<CardHeader>
				<CardTitle className="font-display">Tendencia de mensajes</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={200}>
					<AreaChart data={data}>
						<defs>
							<linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
								<stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
							</linearGradient>
						</defs>
						<XAxis
							dataKey="date"
							stroke="hsl(var(--muted-foreground))"
							fontSize={12}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis
							stroke="hsl(var(--muted-foreground))"
							fontSize={12}
							tickLine={false}
							axisLine={false}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "hsl(var(--card))",
								border: "1px solid hsl(var(--border))",
								borderRadius: "var(--radius)",
							}}
						/>
						<Area
							type="monotone"
							dataKey="messages"
							stroke="hsl(var(--primary))"
							strokeWidth={2}
							fillOpacity={1}
							fill="url(#colorMessages)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};

