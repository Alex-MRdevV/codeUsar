interface InfoCardProps {
	message: string;
}

export default function InfoCard({ message }: InfoCardProps) {
	return (
		<div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4">
			<p className="text-xs text-secondary/80">
				<strong>Consejo:</strong> {message}
			</p>
		</div>
	);
}
