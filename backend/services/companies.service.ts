import { db } from '@/db';
import { companiesTable } from '@/db/schema/companies';
import { companyMembersTable } from '@/db/schema/company-members';
import { usersTable } from '@/db/schema/users';
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
	getCompanyByOwnerId: async (ownerId: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(companiesTable).where(eq(companiesTable.owner_id, ownerId));
	},
	getCompanyByUserId: async (userId: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}

		// First try to get company through company_members table
		const companyFromMembers = await database
			.select({
				company: companiesTable,
			})
			.from(companyMembersTable)
			.innerJoin(companiesTable, eq(companyMembersTable.company_id, companiesTable.id))
			.where(eq(companyMembersTable.user_id, userId))
			.limit(1);

		if (companyFromMembers.length > 0) {
			return companyFromMembers;
		}

		// Fallback: check if user has organization field set and get company by that ID
		const user = await database.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
		if (user.length > 0 && user[0].organizations) {
			const companyFromOrg = await database
				.select({
					company: companiesTable,
				})
				.from(companiesTable)
				.where(eq(companiesTable.id, user[0].organizations))
				.limit(1);

			return companyFromOrg;
		}

		return [];
	},
	getCompanyByAddress: async (address: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}
		return database.select().from(companiesTable).where(eq(companiesTable.address, address));
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
	getCompanyMembers: async (companyId: string) => {
		const database = db;
		if (!database) {
			throw new Error('Database not found');
		}

		// Get all members of the company with their user details
		return database
			.select({
				member: companyMembersTable,
				user: usersTable,
			})
			.from(companyMembersTable)
			.innerJoin(usersTable, eq(companyMembersTable.user_id, usersTable.id))
			.where(eq(companyMembersTable.company_id, companyId));
	},
};
