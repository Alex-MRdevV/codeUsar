import type { WindowStatus } from "@/utils/types/chats";

export function getWindowStatus(lastResponseDate: string | null): WindowStatus {
	if (!lastResponseDate) {
		return {
			isActive: false,
			isExpiring: false,
			expiresAt: null,
			hoursRemaining: null,
		};
	}

	const responseTime = new Date(lastResponseDate);
	const expiresAt = new Date(responseTime.getTime() + 24 * 60 * 60 * 1000);
	const now = new Date();
	const hoursRemaining = Math.max(
		0,
		(expiresAt.getTime() - now.getTime()) / (60 * 60 * 1000)
	);

	return {
		isActive: hoursRemaining > 0,
		isExpiring: hoursRemaining > 0 && hoursRemaining <= 4,
		expiresAt,
		hoursRemaining:
			hoursRemaining > 0 ? Math.round(hoursRemaining * 10) / 10 : null,
	};
}

export function formatTimeAgo(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / (60 * 1000));
	const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
	const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

	if (diffMins < 1) return "ahora";
	if (diffMins < 60) return `${diffMins}m`;
	if (diffHours < 24) return `${diffHours}h`;
	if (diffDays < 7) return `${diffDays}d`;
	return date.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

export function formatMessageTime(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleTimeString("es-MX", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffDays = Math.floor(
		(now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000)
	);

	if (diffDays === 0) return "Hoy";
	if (diffDays === 1) return "Ayer";
	return date.toLocaleDateString("es-MX", { day: "numeric", month: "long" });
}
