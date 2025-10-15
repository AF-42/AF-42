import * as model from '../models';
import { type challengesTable } from '@/db/schema/challenges';

export const challengeService = {
    async createChallenge(challenge: typeof challengesTable.$inferInsert) {
        return model.challenges.create(challenge);
    },
    async getAllChallenges() {
        return model.challenges.getAll();
    },
    async getChallengeById(id: string) {
        return model.challenges.getById(id);
    },
    async getChallengeByEngineerId(engineer_id: string) {
        return model.challenges.getByEngineerId(engineer_id);
    },
    async getChallengeByCompanyId(company_id: string) {
        return model.challenges.getByCompanyId(company_id);
    },
    async updateChallenge(id: string, update: Partial<typeof challengesTable.$inferInsert>) {
        return model.challenges.update(id, update);
    },
    async deleteChallenge(id: string) {
        return model.challenges.delete(id);
    }
};
