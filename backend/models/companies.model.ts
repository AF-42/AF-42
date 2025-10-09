import { db as database } from '@/db';
import { companiesTable } from '@/db/schema/companies';
import { companyMembersTable } from '@/db/schema/company-members';
import { usersTable } from '@/db/schema/users';
import { eq } from 'drizzle-orm';

export const companiesModel = {
	create(company: typeof companiesTable.$inferInsert) {
		return database.insert(companiesTable).values(company);
	},
	update(companyId: string, companyData: Partial<typeof companiesTable.$inferInsert>) {
		return database
			.update(companiesTable)
			.set({ ...companyData, updated_at: new Date() })
			.where(eq(companiesTable.id, companyId));
	},
	getAll() {
		return database.select().from(companiesTable);
	},
	getByEmail(email: string) {
		return database.select().from(companiesTable).where(eq(companiesTable.email, email));
	},
	getById(id: string) {
		return database.select().from(companiesTable).where(eq(companiesTable.id, id));
	},
	getByOwnerId(ownerId: string) {
		return database.select().from(companiesTable).where(eq(companiesTable.owner_id, ownerId));
	},
	getByUserId(userId: string) {
		return database.select().from(companiesTable).where(eq(companiesTable.owner_id, userId));
	},
	getMembers(companyId: string) {
		return database
			.select({
				member: {
					id: companyMembersTable.id,
					company_id: companyMembersTable.company_id,
					user_id: companyMembersTable.user_id,
					is_admin: companyMembersTable.is_admin,
					created_at: companyMembersTable.created_at,
					updated_at: companyMembersTable.updated_at,
				},
				user: {
					id: usersTable.id,
					kinde_id: usersTable.kinde_id,
					first_name: usersTable.first_name,
					last_name: usersTable.last_name,
					username: usersTable.username,
					email: usersTable.email,
					role: usersTable.role,
					created_at: usersTable.created_at,
					last_login: usersTable.last_login,
				},
			})
			.from(companyMembersTable)
			.innerJoin(usersTable, eq(companyMembersTable.user_id, usersTable.id))
			.where(eq(companyMembersTable.company_id, companyId));
	},
	getByIndustry(industry: string) {
		return database.select().from(companiesTable).where(eq(companiesTable.industry, industry));
	},
};
