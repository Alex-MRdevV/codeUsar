interface SendButtonProps {
	schedule: boolean;
	onSend: () => void;
}

export default function SendButton({ schedule, onSend }: SendButtonProps) {
	return (
		<button
			onClick={onSend}
			className="w-full bg-linear-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
		>
			✉️ {schedule ? "Programar Envío" : "Enviar Ahora"}
		</button>
	);
}
