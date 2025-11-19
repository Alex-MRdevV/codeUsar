import { object, string, number, optional } from "valibot";

export const userStatsSchema = object({
	id: string(),
	userId: string(),
	totalMessagesSent: number(),
	totalContacts: number(),
	totalOrders: number(),
	totalTimeSavedHours: number(),
	lastMessageAt: optional(string()),
	lastUpdated: string(),
});

export const createUserStatsSchema = object({
	id: string(),
	userId: string(),
	totalMessagesSent: optional(number()),
	totalContacts: optional(number()),
	totalOrders: optional(number()),
	totalTimeSavedHours: optional(number()),
	lastMessageAt: optional(string()),
});

export const updateUserStatsSchema = object({
	totalMessagesSent: optional(number()),
	totalContacts: optional(number()),
	totalOrders: optional(number()),
	totalTimeSavedHours: optional(number()),
	lastMessageAt: optional(string()),
});
