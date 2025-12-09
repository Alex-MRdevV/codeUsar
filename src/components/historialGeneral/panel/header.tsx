import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { HeaderPanelProps } from "@/utils/types/historyGeneral";
import { format, isAfter, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight, PieChart } from "lucide-react";

export const HeaderPanel = ({ goToPreviousDay, isCalendarOpen, setIsCalendarOpen, selectedDate, handleDateSelect, goToNextDay, isToday }: HeaderPanelProps) => {
	return (
		<CardHeader className="">
			<div className="flex items-center justify-between">
				<CardTitle className="font-display flex items-center gap-2">
					<PieChart className="h-5 w-5 text-primary" />
					Estadísticas del Día
				</CardTitle>

				{/* Date Navigation */}
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						onClick={goToPreviousDay}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>

					<Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className="min-w-[200px] justify-center font-medium gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
							>
								<CalendarIcon className="h-4 w-4 text-primary" />
								{format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="center">
							<Calendar
								mode="single"
								selected={selectedDate}
								onSelect={handleDateSelect}
								disabled={(date) => isAfter(startOfDay(date), startOfDay(new Date()))}
								locale={es}
							/>
						</PopoverContent>
					</Popover>

					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						onClick={goToNextDay}
						disabled={isToday}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</CardHeader >
	)
}
