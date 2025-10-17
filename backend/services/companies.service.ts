import * as model from '../models';
import { type companiesTable } from '@/db/schema/companies';

export const companiesService = {
    async createCompany(company: typeof companiesTable.$inferInsert) {
        return model.companies.create(company);
    },
    async getAllCompanies() {
        return model.companies.getAll();
    },
    async getCompanyByEmail(email: string) {
        return model.companies.getByEmail(email);
    },
    async getCompanyById(id: string) {
        return model.companies.getById(id);
    },
    async getCompanyByOwnerId(ownerId: string) {
        return model.companies.getByOwnerId(ownerId);
    },
    async getCompanyByUserId(userId: string) {
        return model.companies.getByUserId(userId);
    },
    async getCompanyByIndustry(industry: string) {
        return model.companies.getByIndustry(industry);
    },
    async getCompanyMembers(companyId: string) {
        return model.companies.getMembers(companyId);
    },
};
