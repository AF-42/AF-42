import { db as database } from '@/db';
import { eq } from 'drizzle-orm';
import { challengesTable } from '@/db/schema/challenges';

export const challengesModel = {
	create(challenge: typeof challengesTable.$inferInsert) {
		return database.insert(challengesTable).values(challenge);
	},
	getAll() {
		return database.select().from(challengesTable);
	},
	getById(id: string) {
		return database.select().from(challengesTable).where(eq(challengesTable.id, id));
	},
	getByChallengeId(challengeId: string) {
		return database.select().from(challengesTable).where(eq(challengesTable.challenge_id, challengeId));
	},
};
