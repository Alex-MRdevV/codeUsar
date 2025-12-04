import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TrendChartProps } from "@/utils/types/historyGeneral";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const TrendChart = ({ data }: TrendChartProps) => {
	return (
		<Card className="shadow-lg border-0 bg-linear-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-sm">
			<CardHeader>
				<CardTitle className="font-display text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-800">
					Tendencia de mensajes
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={200}>
					<AreaChart data={data}>
						<defs>
							<linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
								<stop offset="50%" stopColor="#ec4899" stopOpacity={0.4} />
								<stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
							</linearGradient>
							<linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
								<stop offset="0%" stopColor="#a855f7" />
								<stop offset="50%" stopColor="#ec4899" />
								<stop offset="100%" stopColor="#f97316" />
							</linearGradient>
						</defs>
						<XAxis
							dataKey="date"
							stroke="#94a3b8"
							fontSize={12}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis
							stroke="#94a3b8"
							fontSize={12}
							tickLine={false}
							axisLine={false}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(17, 24, 39, 0.95)",
								border: "1px solid rgba(168, 85, 247, 0.3)",
								borderRadius: "12px",
								boxShadow: "0 10px 40px rgba(168, 85, 247, 0.3)",
								color: "#fff"
							}}
							labelStyle={{ color: "#e2e8f0" }}
						/>
						<Area
							type="monotone"
							dataKey="messages"
							stroke="url(#strokeGradient)"
							strokeWidth={3}
							fillOpacity={1}
							fill="url(#colorMessages)"
							animationDuration={1500}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};
