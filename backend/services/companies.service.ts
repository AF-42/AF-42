import { companiesTable } from '@/db/schema/companies';
import * as model from '../models';

export const companiesService = {
	createCompany: async (company: typeof companiesTable.$inferInsert) => {
		return model.companies.create(company);
	},
	getAllCompanies: async () => {
		return model.companies.getAll();
	},
	getCompanyByEmail: async (email: string) => {
		return model.companies.getByEmail(email);
	},
	getCompanyById: async (id: string) => {
		return model.companies.getById(id);
	},
	getCompanyByOwnerId: async (ownerId: string) => {
		return model.companies.getByOwnerId(ownerId);
	},
	getCompanyByUserId: async (userId: string) => {
		return model.companies.getByUserId(userId);
	},
	getCompanyByIndustry: async (industry: string) => {
		return model.companies.getByIndustry(industry);
	},
	getCompanyMembers: async (companyId: string) => {
		return model.companies.getMembers(companyId);
	},
};
