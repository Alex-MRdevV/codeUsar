export function buildUpdateSet<T extends Record<string, any>>(data: T) {
	const entries = Object.entries(data).filter(([_, v]) => v !== undefined);
	return Object.fromEntries(entries) as Partial<T>;
}

export interface responseMessage {
	message: string;
}
