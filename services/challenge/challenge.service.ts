import { db } from '@/db';
import { challengesTable } from '@/db/schema/challenges';
import { usersTable } from '@/db/schema/users';
import { eq } from 'drizzle-orm';

export const challengeService = {
	createChallenge: async (challenge: typeof challengesTable.$inferInsert) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.insert(challengesTable).values(challenge);
	},
	getAllChallenges: async () => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(challengesTable);
	},
	getChallengeById: async (id: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(challengesTable).where(eq(challengesTable.id, id));
	},
	getChallengeByChallengeId: async (id: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(challengesTable).where(eq(challengesTable.challenge_id, id));
	},
	getChallengeByUserId: async (userId: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}

		// First try to get challenge through challenge_members table
		return database
			.select({
				challenge: challengesTable,
			})
			.from(challengesTable)
			.innerJoin(challengesTable, eq(challengesTable.challenge_id, challengesTable.id))
			.where(eq(challengesTable.company_id, userId))
			.limit(1);
	},
	getChallengeByAddress: async (address: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(challengesTable).where(eq(challengesTable.company_id, address));
	},
	getChallengeByWebsite: async (website: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(challengesTable).where(eq(challengesTable.company_id, website));
	},
	getChallengeByIndustry: async (industry: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(challengesTable).where(eq(challengesTable.company_id, industry));
	},
	getChallengeByDescription: async (description: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(challengesTable).where(eq(challengesTable.company_id, description));
	},
	getChallengeByCreatedAt: async (createdAt: Date) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(challengesTable).where(eq(challengesTable.created_at, createdAt));
	},
	getChallengeByUpdatedAt: async (updatedAt: Date) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(challengesTable).where(eq(challengesTable.updated_at, updatedAt));
	},
	getChallengeMembers: async (companyId: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}

		// Get all members of the company with their user details
		return database
			.select({
				member: challengesTable,
				user: usersTable,
			})
			.from(challengesTable)
			.innerJoin(usersTable, eq(challengesTable.id, usersTable.id))
			.where(eq(challengesTable.company_id, companyId));
	},
};
