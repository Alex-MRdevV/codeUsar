interface ScheduleMessageProps {
	schedule: boolean;
	scheduleTime: string;
	onToggleSchedule: () => void;
	onScheduleTimeChange: (time: string) => void;
}

export default function ScheduleMessage({
	schedule,
	scheduleTime,
	onToggleSchedule,
	onScheduleTimeChange,
}: ScheduleMessageProps) {
	return (
		<section className="bg-card border border-border rounded-xl p-6">
			<label className="flex items-center gap-3 cursor-pointer mb-4">
				<input
					type="checkbox"
					checked={schedule}
					onChange={onToggleSchedule}
					className="w-4 h-4 rounded border-border bg-input cursor-pointer"
				/>
				<span className="text-lg font-semibold">Programar Envío</span>
			</label>
			{schedule && (
				<section className="space-y-3">
					<input
						type="datetime-local"
						value={scheduleTime}
						onChange={(e) => onScheduleTimeChange(e.target.value)}
						className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
					/>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						📅 Se enviará el {scheduleTime ? new Date(scheduleTime).toLocaleDateString() : "selecciona una fecha"}
					</div>
				</section>
			)}
		</section>
	);
}
