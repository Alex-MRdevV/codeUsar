import { HeaderPanel } from "@/components/historialGeneral/panel/header";
import { TemplateList } from "@/components/historialGeneral/panel/templatesList";
import { Card, CardContent } from "@/components/ui/card";
import type { DayStatsPanelProps } from "@/utils/types/historyGeneral";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MessageSquare, Users } from "lucide-react";

export const DayStatsPanel = ({ goToPreviousDay, setIsCalendarOpen, isCalendarOpen, goToNextDay, handleDateSelect, isToday, selectedDate, dayStats }: DayStatsPanelProps) => {
	return (
		<Card className="shadow-elegant border-border/50 overflow-hidden">
			<HeaderPanel
				goToNextDay={goToNextDay}
				goToPreviousDay={goToPreviousDay}
				handleDateSelect={handleDateSelect}
				isCalendarOpen={isCalendarOpen}
				isToday={isToday}
				selectedDate={selectedDate}
				setIsCalendarOpen={setIsCalendarOpen}
			/>

			<CardContent className="pt-6">
				{dayStats && dayStats.totalMessages > 0 ? (
					<div className="space-y-6">
						{/* Summary Stats */}
						<div className="grid grid-cols-2 gap-4">
							<div className="group relative p-4 rounded-xl bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-smooth">
								<div className="flex items-center gap-3">
									<div className="p-2 rounded-lg bg-primary/20">
										<MessageSquare className="h-5 w-5 text-primary" />
									</div>
									<div>
										<p className="text-3xl font-bold font-display text-primary">
											{dayStats.totalMessages.toLocaleString()}
										</p>
										<p className="text-sm text-muted-foreground">Mensajes enviados</p>
									</div>
								</div>
							</div>

							<div className="group relative p-4 rounded-xl bg-linear-to-br from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/40 transition-smooth">
								<div className="flex items-center gap-3">
									<div className="p-2 rounded-lg bg-accent/20">
										<Users className="h-5 w-5 text-accent" />
									</div>
									<div>
										<p className="text-3xl font-bold font-display text-accent">
											{dayStats.uniqueNumbers.toLocaleString()}
										</p>
										<p className="text-sm text-muted-foreground">Números alcanzados</p>
									</div>
								</div>
							</div>
						</div>

						{/* Template Breakdown */}
						<TemplateList
							dayStats={dayStats}
						/>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<div className="p-4 rounded-full bg-muted/50 mb-4">
							<MessageSquare className="h-8 w-8 text-muted-foreground" />
						</div>
						<h3 className="font-display font-semibold text-lg mb-1">Sin actividad</h3>
						<p className="text-sm text-muted-foreground max-w-xs">
							No se enviaron mensajes el {format(selectedDate, "d 'de' MMMM", { locale: es })}
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
