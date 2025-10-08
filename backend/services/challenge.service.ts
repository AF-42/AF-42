import { challengesTable } from '@/db/schema/challenges';
import * as model from '../models';

export const challengeService = {
	createChallenge: async (challenge: typeof challengesTable.$inferInsert) => {
		return model.challenges.create(challenge);
	},
	getAllChallenges: async () => {
		return model.challenges.getAll();
	},
	getChallengeById: async (id: string) => {
		return model.challenges.getById(id);
	},
	getChallengeByEngineerId: async (engineer_id: string) => {
		return model.challenges.getByEngineerId(engineer_id);
	},
	getChallengeByCompanyId: async (company_id: string) => {
		return model.challenges.getByCompanyId(company_id);
	},
};
