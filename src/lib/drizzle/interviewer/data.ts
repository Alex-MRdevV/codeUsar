/*
import { db } from "@/db/db";
import { Interviewer } from "@/db/schema/interviewer";
import { buildUpdateSet } from "@/utils/updateUtilities";
import { eq, sql } from "drizzle-orm";

export const createInterviewer = db
	.insert(Interviewer)
	.values({
		name: sql.placeholder("name"),
		email: sql.placeholder("email"),
		created_at: sql.placeholder("created_at"),
	})
	.prepare();

export const getInterviewers = () => {
	return db
		.select({
			id: Interviewer.id,
			name: Interviewer.name,
			email: Interviewer.email,
		})
		.from(Interviewer);
};

export const updateInterviewer = (name?: string, email?: string) =>
	db
		.update(Interviewer)
		.set(
			buildUpdateSet({
				name,
				email,
			})
		)
		.where(eq(Interviewer.id, sql.placeholder("id")))
		.prepare();

export const deleteInterviewer = db
	.delete(Interviewer)
	.where(eq(Interviewer.id, sql.placeholder("id")))
	.prepare();
*/