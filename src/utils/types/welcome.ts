export interface UserStats {
	totalMessagesSent: number;
	totalTimeSavedHours: number;
	totalContacts: number;
}

export interface WelcomeCardProps {
	nombre: string;
}

export const getGreeting = () => {
	const hour = new Date().getHours();
	if (hour < 12) return "Buenos días";
	if (hour < 18) return "Buenas tardes";
	return "Buenas noches";
};

export const formatTimeSaved = (hours: number) => {
	if (hours === 0) return "0h";
	if (hours < 1) return `${Math.round(hours * 60)}m`;
	return `${hours}h`;
};
