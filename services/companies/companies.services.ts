import { db } from '@/db';
import { companiesTable } from '@/db/schema/companies';
import { companyMembersTable } from '@/db/schema/members';
import { eq } from 'drizzle-orm';

export const companiesService = {
	createCompany: async (company: typeof companiesTable.$inferInsert) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.insert(companiesTable).values(company);
	},
	getAllCompanies: async () => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(companiesTable);
	},
	getCompanyByEmail: async (email: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(companiesTable).where(eq(companiesTable.email, email));
	},
	getCompanyById: async (id: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(companiesTable).where(eq(companiesTable.id, id));
	},
	getCompanyByUserId: async (userId: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		// Join company_members with companies to get company data for a user
		return database
			.select({
				company: companiesTable,
			})
			.from(companyMembersTable)
			.innerJoin(companiesTable, eq(companyMembersTable.company_id, companiesTable.id))
			.where(eq(companyMembersTable.user_id, userId))
			.limit(1);
	},
	getCompanyByAddress: async (address: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(companiesTable).where(eq(companiesTable.address, address));
	},
	getCompanyByPhone: async (phone: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(companiesTable).where(eq(companiesTable.phone, phone));
	},
	getCompanyByWebsite: async (website: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(companiesTable).where(eq(companiesTable.website, website));
	},
	getCompanyByIndustry: async (industry: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(companiesTable).where(eq(companiesTable.industry, industry));
	},
	getCompanyByDescription: async (description: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(companiesTable).where(eq(companiesTable.description, description));
	},
	getCompanyByCreatedAt: async (createdAt: Date) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(companiesTable).where(eq(companiesTable.created_at, createdAt));
	},
	getCompanyByUpdatedAt: async (updatedAt: Date) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(companiesTable).where(eq(companiesTable.updated_at, updatedAt));
	},
};
